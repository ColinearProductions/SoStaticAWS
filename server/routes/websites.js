
const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();
const mongoDbProvider = require('../db');


router.post('/',(req,res,next)=>{
    let payload = req.body;
    mongoDbProvider.getDb().collection('websites').insertOne(payload,(err,doc)=>{
        res.send(doc.insertedId);
    });
});

router.post('/:websiteid',(req,res,next)=>{
   let payload = req.body;
   let websiteId = req.params.websiteid;

   let query = {
       _id:ObjectID(websiteId)
   };

   mongoDbProvider.getDb().collection('websites').updateOne(query,{$set:payload},(err,doc)=>{
       if(err)
           res.send(err.toString());
       else
           res.send('Ok');
    });

});

router.get('/',(req,res,next)=>{
    let payload = req.body;

    mongoDbProvider.getDb().collection('websites').find({
        owner:payload.owner,
    }).toArray((err,doc)=>{
        res.send(doc);
    });


});





module.exports = router;
