const express = require('express');
const router = express.Router();
const mongoDbProvider = require('../database/db');




const authMiddleware = require('../authMiddleware');

router.use(authMiddleware);




router.get('/list', (req, res) => {



    let start =  parseInt(req.query.start, 10);
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
        query.valid = false; //todo implementation on client

    if (formId !== '-1') //todo or null
        query.form_id = formId;

    if (websiteId !== '-1')
        query.website_id = websiteId;


    let countCursor = mongoDbProvider.getDb().collection('messages').find(query);
    countCursor.count().then((count)=> {
        console.log("COUNT", count);

        countCursor.skip((page - 1) * itemsPerPage).limit(itemsPerPage).toArray(function (err, result) {
            if (err) throw err;
            res.send({count: count, messages: result});

        })
    });

});

module.exports = router;
