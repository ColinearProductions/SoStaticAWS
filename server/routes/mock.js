
const express = require('express');
const router = express.Router();
const mongoDbProvider = require('../db');


const testUserId = "PPlkcvs0O5bC4TGZY4MeXt1xCqJ2";
const testWebsiteId = "-LVDjHbwZtz-REzso7qH";
const testForm1 = "-LVDk7W1oAukb19E4Z6n";
const testForm2 = "-LVDkGsACAqvcnrVgbPB";
const destinationEmail = "becheru.razvan@gmail.com";


router.get('/messages', (req, res, next) => {

    mongoDbProvider.getDb().collection('messages').find().toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
    })
});


router.post('/message',(req,res)=>{

    console.log(req.body);
    console.log(req.params);
    let message = {};
    message.timestamp = Date.now()+req.body.delta_minutes*60;
    message.form_id = req.body.form===1 ? testForm1 : testForm2 ;
    message.form_name = req.body.form===1 ? "TestForm1":"TestForm2";
    message.website_id = testWebsiteId;
    message.website_name = "TestWebsite";
    message.sent_to = destinationEmail;
    message.userId = testUserId;
    message.payload = {
        "field1":"field1",
        "field2":"field2",
        "field3":"field3"
    };
    message.source_website = "localhost";
    message.source_page = "http://localhost:3001";
    message.valid = req.body.valid;
    message.err_message = req.body.error;


    mongoDbProvider.getDb().collection('messages').insertOne(message, function (err, doc) {
        console.log("Store on mongodb: ");
        console.log("Error:", err);
        res.sendStatus(200);
    });

});

router.delete('/messages', (req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    console.log(start,end);

    mongoDbProvider.getDb().collection('messages').deleteMany({
        timestamp:{
            $lt:end,
            $gt:start
        }
    }, (err, result)=>{
        if(err) throw err;
        res.send(result);
    });

});


module.exports = router;