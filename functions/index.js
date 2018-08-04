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

const VERSION = 'Version'+'6';

app.post("/:endpointId", (request, response) => {

    console.log(VERSION);

    let endpointId = request.params['endpointId'];

    console.log("Received message for "+endpointId);

    let postParams = request.body;
    let task = {
        endpointId:endpointId,
        requestProtocol:request.protocol,
        requestHost:request.get('origin').split(":")[0], //todo get rid of the host concept, no enforcement at all, just for descriptive purpuses
        message:postParams
    };

    response.send(task);
    return db.ref('/tasks').push(task).then(function(){
        console.log('Created task:');
    });





//todo redirect url

});


//todo IDEA
//todo Management logic on firebase,
//todo Endpoints logic on aws server


const onNewTask = functions.database.ref('/tasks/{taskId}').onCreate((snapshot, context) => {
    console.log(VERSION);

    console.log(" ON NEW TASK MOTHER FUKERRR");



    let snapshotVal = snapshot.val();
    let endpointId = snapshotVal.endpointId;
    let message = snapshotVal.message;
    let wasRequestHttps = snapshotVal.requestProtocol ==='https';
    let requestHost = snapshotVal.requestHost;

    //why would you assume the endpoint exists?
    return  db.ref('/endpoints/'+endpointId).once('value').then(function (endpointSnapshot) {

        console.log("*****************");
        console.log(endpointSnapshot.val());

        let formId = endpointSnapshot.val().form;
        let websiteId = endpointSnapshot.val().website;
        let userId = endpointSnapshot.val().user;


        //read website configuration
        return db.ref('/users/' + userId + '/websites/' + websiteId).once('value').then(websiteSnapshot => {

            console.log("GOT HERE 1111");
            let websiteConfig = websiteSnapshot.val();
            websiteConfig.key = websiteId;

            let formConfig = websiteConfig.forms[formId];
            formConfig.key = formId;


            if (websiteConfig.httpsOnly && !wasRequestHttps)
                console.log("Website expected https, dropping request");


            if (formConfig.recaptcha)
                validateRecaptcha(message, websiteConfig, formConfig);
            else
                onValidMessage(message, websiteConfig, formConfig, userId)



        }).catch((ex) => {
            console.log("Exception on message received");
            console.log(ex);
            console.log(ex.message);
        });

    });
});


function validateRecaptcha(postParams, websiteConfig, formConfig, userId) {
    console.log("Validating recaptcha");
    requestPromise({
        uri: recaptchaValidationURL,
        method: 'POST',
        formData: {
            secret: websiteConfig.secret,
            response: postParams['g-recaptcha-response']
        },
        json: true
    }).then(result => {
        if (result.success) {
            console.log("Recaptcha matched successfully");
            emailMessage(postParams, websiteConfig, formConfig);
            onValidMessage(postParams, websiteConfig, formConfig, userId)
        } else
            console.log("Recaptcha validation failed, dropping message")

    });
}


function onValidMessage(postParams, websiteConfig, formConfig, userId) {

    console.log("On Valid message");
    delete postParams['g-recaptcha-response'];

    loadTemplatePromise(postParams, websiteConfig, formConfig);

    let message = {};
    message.formId = formConfig.key;
    message.addedOn = admin.firestore.FieldValue.serverTimestamp();
    message.websiteId = websiteConfig.key;
    message.userId = userId;
    message.data = postParams;


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


        emailMessage(rendered, websiteConfig)
    });
    console.log("Load template ended");
}

function loadTemplatePromise(postParams, websiteConfig, formConfig) {
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


        emailMessage(rendered, websiteConfig)
    });



    console.log("Load template ended");
}

function emailMessage(html, websiteConfig) {
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
