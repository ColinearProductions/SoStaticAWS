
const express = require('express');
const router = express.Router();


const VERSION = '2';


router.get('/v', (req,res)=>{
   res.send(VERSION)
});





module.exports = router;