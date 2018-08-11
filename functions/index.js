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


    console.log("\n\n --- Processing new task --- \n\n");


    return db.ref('/endpoints/'+endpointId).once('value').then(function (endpointSnapshot) {

        console.log("-------- Endpoint data --------");
        console.log(endpointSnapshot.val());
        console.log("-------------------------------\n\n");

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
            console.log("-----------------------------------------------------------\n\n\n");


            if (websiteConfig.httpsOnly && !wasRequestHttps) {
                console.err(">>>>>>>>>> Website expected https, dropping request");
            }


            if (formConfig.recaptcha) {
                if(payload['g-recaptcha-response']===undefined) //form requires recaptcha, but no recapcha field has been received
                    return;
                validateRecaptcha(payload, websiteConfig, formConfig, userId);
            }
            else
                storeMessage(payload, websiteConfig, formConfig, userId)



        }).catch((ex) => {
            console.log("Exception on message received");
            console.log(ex);
            console.log(ex.message);
        });

    });
});


function validateRecaptcha(postParams, websiteConfig, formConfig, userId) {

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
            sendEmail(postParams, websiteConfig, formConfig);
            storeMessage(postParams, websiteConfig, formConfig, userId)
        } else
            console.log("Recaptcha validation failed, dropping message")
            //todo save message but without email, and mark field as invalid
    });
}


//store message no matter what, if it is valid, also email it
function storeMessage(postParams, websiteConfig, formConfig, userId,valid,failure_reason) {

    console.log("On Valid message");
    delete postParams['g-recaptcha-response'];




    let message = {};
    message.formId = formConfig.key;
    message.addedOn = admin.firestore.FieldValue.serverTimestamp();
    message.websiteId = websiteConfig.key;
    message.userId = userId;
    message.data = postParams;


    if(valid)
        onValidMessage(postParams, websiteConfig, formConfig);


    return firestore.collection('messages').add(message);
}

function loadTemplate(postParams, websiteConfig, formConfig) {
    console.log("Loading template");
    request(pathToTemplate, (error, response, body) => {
        console.log("On request result");

        console.log(error);
        console.log(response);
        console.log(body);


        let template = body;
        let entries = [];


        for (let key in postParams)
            if (postParams.hasOwnProperty(key))
                entries.push({key: key, value: postParams[key]});

        console.log(postParams);


        let emailData = {
            'alias': websiteConfig.alias,
            'formAlias': formConfig.alias,
            'entries': entries,
            'websiteurl': websiteConfig.url,
            'unsubscribeUrl': ""

        };

        console.log(emailData);
        let rendered = Mustache.render(template, emailData);


        sendEmail(rendered, websiteConfig)
    });
    console.log("Load template ended");
}

function onValidMessage(postParams, websiteConfig, formConfig) {
    console.log("Loading template");
    requestPromise({uri:pathToTemplate,method:'GET'}).then(result=>{

        console.log(result);


        let template = result;
        let entries = [];


        for (let key in postParams)
            if (postParams.hasOwnProperty(key))
                entries.push({key: key, value: postParams[key]});

        console.log(postParams);


        let emailData = {
            'alias': websiteConfig.alias,
            'formAlias': formConfig.alias,
            'entries': entries,
            'websiteurl': websiteConfig.url,
            'unsubscribeUrl': ""

        };

        console.log(emailData);
        let rendered = Mustache.render(template, emailData);


        sendEmail(rendered, websiteConfig)
    });



    console.log("Load template ended");
}

function sendEmail(html, websiteConfig) {
    console.log("Email Message");

    if (websiteConfig.contacts === undefined)
        return;

    let email = objToArray(websiteConfig.contacts)[0].email;
    const mailOptions = {
        from: "So Static",
        to: email
    };

    // The user subscribed to the newsletter.
    mailOptions.subject = 'New submission  - ' + websiteConfig.alias;
    mailOptions.html = html;


    return mailtransport.sendMail(mailOptions).then(() => {
        console.log('New welcome email sent to:', email);
    }).catch((resolve, reject) => {
        console.log("(((", resolve);
        console.log(reject);

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


    db.ref('/users/' + user.uid).set(blankUser).then((resp) => console.log("RESP: " + resp));

});

//todo maybe add event logs, with all the declined messages + reasons for decline


const endpoint = functions.https.onRequest(app);

module.exports = {
    endpoint, onUserCreated,onNewTask
};
