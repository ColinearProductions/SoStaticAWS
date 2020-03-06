const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();

const authMiddleware = require('../authMiddleware');

const Models = require('../database/models');

router.use(authMiddleware);


//update form
router.post('/deletion_task', (req, res, next) => {
    let uid = req.token.uid;
    let timestamp = Math.round(new Date().getTime() / 1000) + 48*3600;

    let task = Models.DeletionTask({
        uid,timestamp
    });

    task.save((error, doc) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            console.log(doc);
            res.status(200).send({timestamp});
        }
    });
});


//update form
router.delete('/deletion_task', (req, res, next) => {
    let uid = req.token.uid;

    let query = {uid: uid};
    Models.DeletionTask.findOneAndDelete(query).then(doc => {

        if(doc === null)
            res.status(404).send(doc);
        else
            res.status(200).send(doc);
    }).catch(error => {
        console.error(error);
        res.sendStatus(500);
    });

});

//update form
router.get('/deletion_task', (req, res, next) => {
    let uid = req.token.uid;

    let query = {uid: uid};
    Models.DeletionTask.findOne(query).then(doc => {

        if(doc === null)
            res.status(404).send(doc);
        else
            res.status(200).send(doc);
    }).catch(error => {
        console.error(error);
        res.sendStatus(500);
    });

});



module.exports = router;
