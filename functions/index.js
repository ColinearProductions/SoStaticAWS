const functions = require('firebase-functions');
let request = require('request');
let admin = require("firebase-admin");
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const requestPromise = require('request-promise');
const Mustache = require('mustache');

const express = require("express");
let recaptchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify";

const gmailUsername = "sostatic.xyz";
const gmailPassword = "jQ6sbEu3";
//const mailtransport = nodemailer.createTransport('smtps://' + gmailUsername + ':' + gmailPassword + '@smtp.gmail.com');
const mailtransport = nodemailer.createTransport({service:'gmail',auth:{user:gmailUsername,pass:gmailPassword}});


const pathToTemplate = "https://firebasestorage.googleapis.com/v0/b/sostatic-1d381.appspot.com/o/inlined.html?alt=media&token=7160622a-335e-4028-aed3-f2bd3caa8859";

const app = express();




app.use(bodyParser.urlencoded({extended: true}));


admin.initializeApp(functions.config().firebase);
let db = admin.database();

let firestore = admin.firestore();


const VERSION = 'Version'+'9';





app.post("/:endpointId", (request, response) => {


    let endpointId = request.params['endpointId'];

    let task = {
        endpointId:endpointId,
        requestProtocol:request.protocol,
        requestHost:request.get('origin'), //todo get rid of the host concept, no enforcement at all, just for descriptive purpuses
        payload:request.body
    };

    console.log("Received message on endpoint", endpointId);
    console.log("---------------------- Creating task ----------------------");
    console.log(task);
    response.send(task);
    return db.ref('/tasks').push(task).then(function(){
        console.log("---------------------- Created task ----------------------");
    });





//todo redirect url

});


//todo IDEA
//todo Management logic on firebase,
//todo Endpoints logic on aws server


const onNewTask = functions.database.ref('/tasks/{taskId}').onCreate((snapshot, context) => {

    let snapshotVal = snapshot.val();
    let endpointId = snapshotVal.endpointId;
    let payload = snapshotVal.payload;
    let wasRequestHttps = snapshotVal.requestProtocol ==='https';
    let requestHost = snapshotVal.requestHost;

    printBreak();
    console.log("--- Processing new task ---");
    printBreak();


    return db.ref('/endpoints/'+endpointId).once('value').then(function (endpointSnapshot) {

        console.log("-------- Endpoint data --------");
        console.log(endpointSnapshot.val());
        console.log("-------------------------------");
        printBreak();

        let formId = endpointSnapshot.val().form;
        let websiteId = endpointSnapshot.val().website;
        let userId = endpointSnapshot.val().user;

        //read website configuration
        return db.ref('/users/' + userId + '/websites/' + websiteId).once('value').then(websiteSnapshot => {

            let websiteConfig = websiteSnapshot.val();
            websiteConfig.key = websiteId;
            let formConfig = websiteConfig.forms[formId];
            formConfig.key = formId;

            console.log("------------- On website configuration loaded -------------");
            console.log(websiteConfig);
            console.log("-----------------------------------------------------------");
            printBreak();


            if (websiteConfig.httpsOnly && !wasRequestHttps) {
                storeMessage(payload, websiteConfig, formConfig, userId, requestHost,false,"Request did not come from a secure source (no HTTPS)");
                console.error(">>>>>>>>>> Website expected https, dropping request");
            }


            if (formConfig.recaptcha) {
                if(payload['g-recaptcha-response']===undefined) //form requires recaptcha, but no recapcha field has been received
                    storeMessage(payload, websiteConfig, formConfig, userId, requestHost,false,'Missing recaptcha field');
                validateRecaptcha(payload, websiteConfig, formConfig, userId, requestHost);
            }else
                storeMessage(payload, websiteConfig, formConfig, userId, requestHost,true)



        }).catch((ex) => {
            console.log("Exception on message received");
            console.log(ex);
            console.log(ex.message);
        });

    });
});


function validateRecaptcha(postParams, websiteConfig, formConfig, userId, requestHost) {

    requestPromise({
        uri: recaptchaValidationURL,
        method: 'POST',
        formData: {
            secret: websiteConfig.secret,
            response: postParams['g-recaptcha-response']
        },
        json: true
    }).then(result => {
        console.log("***",result);
        if (result.success) {
            console.log("Recaptcha matched successfully");
            //todo add field that it has been validated
            onValidMessage(postParams, websiteConfig, formConfig);
            storeMessage(postParams, websiteConfig, formConfig, userId, requestHost,true)
        } else {
            console.log("Recaptcha validation failed, dropping message");
            storeMessage(postParams, websiteConfig, formConfig, userId, requestHost, false, "Invalid recaptcha")
        }
        //todo save message but without email, and mark field as invalid
    });
}




/*
todo maybe ad confirmation email options: when a visitor submits a form, you can send him a confirmation of received on certain forms
todo how to call firebase functions from sostatic.xyz instead of that long link
{
  "hosting": {
    "public": "public",

    // Add the following rewrites section *within* "hosting"
    "rewrites": [ {
      "source": "/bigben", "function": "bigben"
    } ]
  }
}

 */

//store message no matter what, if it is valid, also email it
function storeMessage(payload, websiteConfig, formConfig, userId,requestHost, valid,failure_reason) {

    console.log("On Valid message");
    delete payload['g-recaptcha-response'];




    let message = {};
    message.timestamp = admin.firestore.FieldValue.serverTimestamp();
    message.form_id = formConfig.key;
    message.form_name = formConfig.alias;
    message.website_id = websiteConfig.key;
    message.website_name =websiteConfig.alias;
    message.sent_to  = websiteConfig.contacts;
    message.userId = userId;
    message.payload = payload;
    message.source_website = requestHost;
    message.valid=valid;


    if(valid) {
        onValidMessage(payload, websiteConfig, formConfig);
        incrementFormMessageCount(userId,websiteConfig.key,formConfig.key)
    }else
        message.failure_reason=failure_reason;


    return firestore.collection('messages').add(message);
}

function incrementFormMessageCount(userId,websiteId,formId){

    let ref = db.ref('/users/' + userId + '/websites/' + websiteId+'/forms/'+formId);
    return ref.once('value').then(formSnapshot => {
        return ref.update({message_count:formSnapshot.val().message_count+1})
    });
}
function onValidMessage(payload, websiteConfig, formConfig) {
    console.log("Loading template...............");

    requestPromise({uri:pathToTemplate,method:'GET'}).then(result=>{

        console.log("Template loaded Successfully");


        let template = result;
        let entries = [];

        for (let key in payload)
            if (payload.hasOwnProperty(key))
                entries.push({key: key, value: payload[key]});

        let emailData = {
            'alias': websiteConfig.alias,
            'formAlias': formConfig.alias,
            'entries': entries,
            'websiteurl': websiteConfig.url,
            'unsubscribeUrl': ""

        };
        let rendered = Mustache.render(template, emailData);


        printBreak();
        console.log("-------- Payload parsed: --------");
        console.log(emailData);
        console.log('---------------------------------');

        sendEmail(rendered, websiteConfig)
    });



    console.log("Load template ended");
}

function printBreak(){
    console.log('');
    console.log('');
    console.log('');
}

function sendEmail(html, websiteConfig) {


    console.log('\n\n\n ------------ Sending Email -----------');

    if (websiteConfig.contacts === undefined){
        console.error('_ No contacts defined for this website');
        return;
    }

    let email = objToArray(websiteConfig.contacts)[0].email;
    const mailOptions = {
        from: "So Static",
        to: email
    };

    // The user subscribed to the newsletter.
    mailOptions.subject = 'New submission  - ' + websiteConfig.alias;
    mailOptions.html = html;


    return mailtransport.sendMail(mailOptions).then(() => {
        console.log('\n\n\n\n************ EMAIL SENT SUCCESSFULLY *********');
        console.log(email);
        console.log('\n\n\n');
    }).catch((resolve, reject) => {
        console.error('\n\n **** EMAIL FAILED TO SEND ***');
        console.log(resolve);
        console.log(reject);
        console.log("***************************");

    });


}


function objToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key]['key'] = key;
        return obj[key];
    });
}



const onUserCreated = functions.auth.user().onCreate((user) => {
    console.log(user);
    let blankUser = {
        websites: [],
        messages: [],
        email: user.email
    };


    return db.ref('/users/' + user.uid).set(blankUser).then((resp) => console.log("RESP: " + resp));

});

//todo maybe add event logs, with all the declined messages + reasons for decline


const endpoint = functions.https.onRequest(app);

module.exports = {
    endpoint, onUserCreated,onNewTask
};
