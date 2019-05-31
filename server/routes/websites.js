const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();
const mongoDbProvider = require('../database/db');

const authMiddleware = require('../authMiddleware');

const Models = require('../database/models');

router.use(authMiddleware);


//create website
router.post('/', (req, res) => {

    let payload = req.body;
    payload.owner = req.token.uid;

    let website = Models.Website(payload);

    website.save((error, doc) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            console.log(doc);
            res.status(200).send(doc);
        }
    });


});


//update website
router.post('/:websiteid', (req, res) => {
    let payload = req.body;
    let websiteId = req.params.websiteid;
    let uid = req.token.uid;
    delete payload._id;


    let query = {
        _id: ObjectID(websiteId),
        owner: uid
    };
    let options = {new: true};

    Models.Website.findOneAndUpdate(query, payload, options).then(doc => {

        console.log(doc);
        res.status(200).send(doc);

    }).catch(error => {
        console.error(error);
        res.sendStatus(500);
    });


});

router.get('/', (req, res) => {
    let uid = req.token.uid;

    let query = {owner: uid};
    Models.Website.find(query).then(doc => {
        console.log(doc);
        res.send(doc);
    }).catch(error => {
        console.error(error);
        res.sendStatus(500);
    });


});


// FORMS

//create form
router.post('/:websiteid/forms/', (req, res) => {


    let uid = req.token.uid;
    let websiteId = req.params.websiteid;
    let payload = req.body;


    let query = {
        _id: ObjectID(websiteId),
        owner: uid
    };

    Models.Website.findOneAndUpdate(query,
        {
            $push: {
                forms: payload
            }
        },
        {new: true}
    ).then(doc => {
        console.log(doc);
        res.status(200).send(doc);
    }).catch(error => {
        console.error(error);
        res.sendStatus(500);
    })


});

//todo delete form by setting its active field to false

router.post('/:websiteid/forms/:formId', (req, res, next) => {
    let uid = req.token.uid;
    let websiteId = req.params.websiteid;
    let formId = req.params.formId;
    let payload = req.body;
    payload._id = ObjectID(formId);





    let query = {
        owner: uid,
        _id: ObjectID(websiteId),
        'forms._id': ObjectID(formId),
    };

    Models.Website.findOneAndUpdate(query,
        {
            $set: {
                'forms.$.alias': payload.alias,
                'forms.$.recaptcha': payload.recaptcha,
            }
        },
        {new: true}
    ).then(doc => {
        console.log(doc);
        res.status(200).send(doc);
    }).catch(error => {
        console.error(error);
        res.sendStatus(500);
    })


});


module.exports = router;
