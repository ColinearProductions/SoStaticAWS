
const express = require('express');
const router = express.Router();
const requestPromise = require('request-promise');
const admin = require('firebase-admin');



const recaptchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify";
const sendgridUtils = require('../sendgrid');


const mongoDbProvider = require('../database/db');


let firebaseDB = admin.database();







router.post('/:endpointId', (request, response) => {

    //todo redirect to url
    response.sendStatus(200);

    let endpointId = request.params.endpointId;
    let isHttps = request.protocol === 'https';
    let requestHost = request.get('origin');
    let referer = request.get('referer');
    let payload = request.body;


    return firebaseDB.ref('/endpoints/' + endpointId).once('value').then(function (endpointSnapshot) {
        let endpointData = endpointSnapshot.val();
        let formId = endpointData.form;
        let websiteId = endpointData.website;
        let userId = endpointData.user;

        return firebaseDB.ref('/users/' + userId + '/websites/' + websiteId).once('value').then(websiteSnapshot => {
            let websiteConfig = websiteSnapshot.val();
            websiteConfig.key = websiteId;
            let formConfig = websiteConfig.forms[formId];
            formConfig.key = formId;

            if (websiteConfig.httpsOnly && !isHttps)
                storeMessage(payload, websiteConfig, formConfig, userId, requestHost, referer, "The message did not come from a HTTPs source");

            if (formConfig.recaptcha) {
                if (payload['g-recaptcha-response'] === undefined)
                    storeMessage(payload, websiteConfig, formConfig, userId, requestHost, referer, "Missing recaptcha field");
                else {
                    validateRecaptcha(payload, websiteConfig, formConfig, userId, requestHost, referer)
                }
            } else {
                storeMessage(payload, websiteConfig, formConfig, userId, requestHost, referer);
            }

        });

    });


});

function storeMessage(payload, websiteConfig, formConfig, userId, requestHost, referer, error) {
    let valid = error === undefined;

    let message = {};
    message.timestamp = Date.now();
    message.form_id = formConfig.key;
    message.form_name = formConfig.alias;
    message.website_id = websiteConfig.key;
    message.website_name = websiteConfig.alias;
    message.sent_to = websiteConfig.contacts;
    message.userId = userId;
    message.payload = payload;
    message.source_website = requestHost;
    message.source_page = referer;
    message.valid = valid;
    message.err_message = error;


    mongoDbProvider.getDb().collection('messages').insertOne(message, function (err, doc) {
        console.log("Store on mongodb: ");
        console.log("Error:", err);
    });


    sendgridUtils.sendMessage(payload, websiteConfig, formConfig);

}

function validateRecaptcha(payload, websiteConfig, formConfig, userId, requestHost, referer) {

    requestPromise({
        uri: recaptchaValidationURL,
        method: 'POST',
        formData: {
            secret: websiteConfig.secret,
            response: payload['g-recaptcha-response']
        },
        json: true
    }).then(result => {
        if (result.success)
            storeMessage(payload, websiteConfig, formConfig, userId, requestHost, referer);
        else
            storeMessage(payload, websiteConfig, formConfig, userId, requestHost, referer, "Failed recaptcha check");
    });
}

module.exports = router;
