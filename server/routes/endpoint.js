const Models = require('../database/models');

const express = require('express');
const router = express.Router();
const requestPromise = require('request-promise');


const recaptchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify";
const sendgridUtils = require('../sendgrid');
const ObjectID = require('mongodb').ObjectID;


const mongoDbProvider = require('../database/db');

const url = require('url');

const subdomainRedirect = process.env.NODE_ENV === 'development'?'http://localhost:8080':'https://app.sostatic.xyz';


router.get('/', (request, response) => {
    console.log(request.url);
    response.redirect(subdomainRedirect+request.url);
});


router.post('/:formId', (request, response) => {

    let formId = request.params.formId;
    let payload =  request.body;
    let isHttps = request.protocol === 'https';
    let payloadRecaptcha = payload['g-recaptcha-response'];
    let referer = request.get('referer');


    let requestDomain = url.parse(request.get('origin')).hostname;



    console.log(formId);

    let query = {
        'forms._id': ObjectID(formId)
    };


    Models.Website.findOne(query).select().then(doc => {


        let websiteConfig = doc;
        let userId = websiteConfig.owner;
        let formConfig = websiteConfig.forms.filter(form=>String(form._id)===String(formId))[0];



        if (websiteConfig.httpsOnly && !isHttps) {
            storeMessage(payload, websiteConfig, formConfig, userId, requestDomain, referer, "The message did not come from a HTTPs source");
            return;
        }

        let matchingSourceDomain = websiteConfig.domains.find((domain)=>{
           return domain.name === requestDomain ;
        });

        if(requestDomain==='sostatic.xyz' ||  requestDomain==='www.sostatic.xyz')
            matchingSourceDomain = requestDomain;

        if(matchingSourceDomain === undefined )
        {
            storeMessage(payload, websiteConfig, formConfig, userId, requestDomain, referer, `The source origin of the request (${requestDomain}) did not matched any defined domains`);
            return;
        }




        if (formConfig.recaptcha) {
            if ( payloadRecaptcha === undefined)
                storeMessage(payload, websiteConfig, formConfig, userId, requestDomain, referer, "Missing recaptcha field");
            else {
                validateRecaptcha(payload, websiteConfig, formConfig, userId, requestDomain, referer)
            }
        } else {
            storeMessage(payload, websiteConfig, formConfig, userId, requestDomain, referer);
        }

    }).catch(error => {
        console.error(error);
    });

    response.sendStatus(200)


});



function storeMessage(payload, websiteConfig, formConfig, userId, requestDomain, referer, error) {
    let valid = error === undefined;

    if(!valid)
        console.error(error);

    let message = {};
    message.timestamp = Date.now();
    message.form_id = formConfig._id;
    message.form_name = formConfig.alias;
    message.website_id = websiteConfig._id;
    message.website_name = websiteConfig.alias;
    message.sent_to = websiteConfig.contacts;
    message.userId = userId;
    message.payload = payload;
    message.source_website = requestDomain;
    message.source_page = referer;
    message.valid = valid;
    message.err_message = error;


    mongoDbProvider.getDb().collection('messages').insertOne(message, function (err, doc) {
        console.log("Store on mongodb: ");
        if(error)
            console.log("Error:", err);
    });


    if(valid)
        sendgridUtils.sendMessage(payload, websiteConfig, formConfig);

}

function validateRecaptcha(payload, websiteConfig, formConfig, userId, requestDomain, referer) {

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
            storeMessage(payload, websiteConfig, formConfig, userId, requestDomain, referer);
        else
            storeMessage(payload, websiteConfig, formConfig, userId, requestDomain, referer, "Failed recaptcha check");
    });
}


module.exports = router;
