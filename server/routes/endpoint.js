const Models = require('../database/models');

const express = require('express');
const router = express.Router();
const requestPromise = require('request-promise');


const recaptchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify";
const sendgridUtils = require('../sendgrid');
const ObjectID = require('mongodb').ObjectID;


const mongoDbProvider = require('../database/db');



router.post('/:formId', (request, response) => {

    let formId = request.params.formId;
    let payload =  request.body;
    let isHttps = request.protocol === 'https';
    let requestHost = request.get('origin');
    let referer = request.get('referer');


    console.log(formId);

    let query = {
        'forms._id': ObjectID(formId)
    };


    Models.Website.findOne(query).select().then(doc => {





        let websiteConfig = doc;

        let userId = websiteConfig.owner;


        let formConfig = websiteConfig.forms.filter(form=>String(form._id)===String(formId))[0];


        console.log(formConfig);


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





    }).catch(error => {
        console.error(error);
    });

    response.send(200)


});



function storeMessage(payload, websiteConfig, formConfig, userId, requestHost, referer, error) {
    let valid = error === undefined;

    let message = {};
    message.timestamp = Date.now();
    message.form_id = formConfig._id;
    message.form_name = formConfig.alias;
    message.website_id = websiteConfig._id;
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


    //only send if  valid
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
