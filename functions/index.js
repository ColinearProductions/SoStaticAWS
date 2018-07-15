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
const mailtransport = nodemailer.createTransport(
    'smtps://' + gmailUsername + ':' + gmailPassword + '@smtp.gmail.com');


const pathToTemplate = "https://sostatic.xyz/email.html";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));


admin.initializeApp(functions.config().firebase);
let db = admin.database();

let firestore = admin.firestore();


app.post("/:endpointId", (request, response) => {
    let endpointId = request.params['endpointId'];

    console.log(endpointId);

    let postParams = request.body;


    let ref = db.ref('/endpoints/'+endpointId);

    ref.once('value').then(function(endpointSnapshot) {

        console.log("*****************");
        console.log(endpointSnapshot.val());
        let formId = endpointSnapshot.val().form;
        let websiteId = endpointSnapshot.val().website;
        let userId = endpointSnapshot.val().user;


        //read website configuration
        db.ref('/users/'+userId+'/websites/' + websiteId).once('value').then(websiteSnapshot => {

            let websiteConfig = websiteSnapshot.val();
            websiteConfig.key = websiteId;

            let formConfig = websiteConfig.forms[formId];
            formConfig.key = formId;


            if (websiteConfig.httpsOnly && request.protocol !== 'https')
                console.log("Website expected https, dropping request");

            if (websiteConfig.url !== request.get('host').split(":")[0])
                console.log("Website defined domain does not match source domain of request, dropping request");

            if (formConfig.recaptcha)
                //websiteConfig.secret,
                validateRecaptcha(postParams, websiteConfig, formConfig);
            else {
                onValidMessage(postParams, websiteConfig, formConfig, userId)
            }


        }).catch((ex) => {
            console.log("Exception on message received");
            console.log(ex);
            console.log(ex.message);
        });

    });
    let messageObj = request.body;
    response.send(messageObj)


//todo redirect url

});


function validateRecaptcha( postParams, websiteConfig, formConfig, userId) {
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

    delete postParams['g-recaptcha-response'];

    loadTemplate(postParams, websiteConfig, formConfig);

    let message = {};
    message.formId = formConfig.key;
    message.addedOn = admin.firestore.FieldValue.serverTimestamp();
    message.websiteId = websiteConfig.key;
    message.userId = userId;
    message.data = postParams;



    return firestore.collection('messages').add(message);
}

function loadTemplate(postParams, websiteConfig, formConfig) {
    request(pathToTemplate, (error, response, body) => {
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
}

function emailMessage(html, websiteConfig) {


    if(websiteConfig.contacts === undefined)
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
        console.log(resolve);
        console.log(reject);

    });


}


function objToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key]['key'] = key;
        return obj[key];
    });
}

/* moved on the client
const onFormCreated = functions.database.ref('/users/{userId}/websites/{websiteId}/forms/{formId}').onCreate((snapshot, context) => {
    console.log(context);
    console.log(snapshot);

    let formid = context.params.formId;
    let websiteid = context.params.websiteId;
    let userid = context.params.userId;



    let endpointData = {form: formid, website: websiteid, user: userid};
    console.log(endpointData);
    let endpoint = db.ref('/endpoints').push(endpointData).key;

    console.log(endpoint);



    return db.ref(snapshot._path).update({endpoint: endpoint, key:formid})

}); */


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
    endpoint,
    onUserCreated: onUserCreated,
  //  onFormCreated: onFormCreated
};
