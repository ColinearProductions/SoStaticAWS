
const express = require('express');
const router = express.Router();
const requestPromise = require('request-promise');
const admin = require('firebase-admin');



const recaptchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify";
const sendgridUtils = require('../sendgrid');


const mongoDbProvider = require('../db');


let firebaseDB = admin.database();





router.get('/list', (req, res, next) => {



    let start = parseInt(req.query.start, 10);
    let end = parseInt(req.query.end, 10);
    let onlyValid = req.query.only_valid === 'true';
    let formId = req.query.form_id;
    let websiteId = req.query.website_id;
    let itemsPerPage = parseInt(req.query.items_per_page);
    let page = parseInt(req.query.page);


    let query = {
        timestamp: {
            $lt: end,
            $gt: start
        }
    };

    if (onlyValid)
        query.valid = true;

    if (formId !== '-1') //todo or null
        query.form_id = formId;

    if (websiteId !== '-1')
        query.website_id = websiteId;



    let countCursor = mongoDbProvider.getDb().collection('messages').find(query);

    countCursor.count().then((count)=> {
        countCursor.skip((page - 1) * itemsPerPage).limit(itemsPerPage).toArray(function (err, result) {
            if (err) throw err;
            res.send({count: count, messages: result});

        })
    });




});


router.post('/m/:endpointId', (request, response) => {

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

    incrementFormMessageCount(userId, websiteConfig.key, formConfig.key);

    mongoDbProvider.getDb().collection('messages').insertOne(message, function (err, doc) {
        console.log("Store on mongodb: ");
        console.log("Error:", err);
    });


    sendgridUtils.sendMessage(payload, websiteConfig, formConfig);

}



function incrementFormMessageCount(userId, websiteId, formId, valid) {
    let ref = firebaseDB.ref('/users/' + userId + '/websites/' + websiteId + '/forms/' + formId);
    return ref.once('value').then(formSnapshot => {
        if (valid)
            return ref.update({message_count: formSnapshot.val().message_count + 1});
        else
            return ref.update({spam_count: formSnapshot.val().spam_count + 1})
    });
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
