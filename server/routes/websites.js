const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();
const mongoDbProvider = require('../db');

const authMiddleware = require('../authMiddleware');

router.use(authMiddleware);


//create website
router.post('/', (req, res) => {
    let payload = req.body;
    payload.owner = req.token.uid;
    mongoDbProvider.getDb().collection('websites').insertOne(payload, (err, doc) => {
        console.log(err);
        res.send(doc.ops[0]);
    });
});


//update website
router.post('/:websiteid', (req, res) => {
    let payload = req.body;
    let websiteId = req.params.websiteid;
    let uid = req.token.uid;
    delete payload._id;

    //only accept certain fields!

    let query = {
        _id: ObjectID(websiteId),
        owner: uid
    };

    mongoDbProvider.getDb().collection('websites').updateOne(query, {$set: payload}, (err, doc) => {
        if (err) {
            console.error(err.toString());
            res.sendStatus(500);
        } else {

            if (doc.matchedCount < 1) {
                res.status(403).send('User does not have permission to modify the website')
            } else {

                res.sendStatus(200);
            }
        }
    });

});

router.get('/', (req, res) => {
    console.log(req.token);
    let uid = req.token.uid;
    mongoDbProvider.getDb().collection('websites').find({
        owner: uid,
    }).toArray((err, doc) => {
        res.send(doc);
    });
});


// FORMS


router.post('/:websiteid/forms/', (req, res, next) => {
    let uid = req.token.uid;
    let websiteId = req.params.websiteid;
    let payload = req.body;
    payload._id = ObjectID();

    mongoDbProvider.getDb().collection('websites').updateOne(
        {
            owner: uid,
            _id: ObjectID(websiteId),
        },
        {
            $push:{
                'forms':payload
            }
        },
        (err, doc)=>{
            res.send("OK")
        });
});

//todo delete form by setting its active field to false

router.post('/:websiteid/forms/:formId', (req, res, next) => {
    let uid = req.token.uid;
    let websiteId = req.params.websiteid;
    let formId = req.params.formId;
    let payload = req.body;
    payload._id = ObjectID(formId);



    mongoDbProvider.getDb().collection('websites').updateOne(
        {
            owner: uid,
            _id: ObjectID(websiteId),
            'forms._id':ObjectID(formId),
        },
        {
            $set:{
                'forms.$':payload
            }
        },
        (err, doc)=>{
            console.error(err);
            console.log(JSON.stringify(doc));
            res.send("OK")
        });
});


module.exports = router;
