

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

let deletionTaskSchema = new mongoose.Schema({
   uid:String,
   timestamp:Number
});

let formSchema = new mongoose.Schema({
    alias: String,
    recaptcha: Boolean,
    message_count: Number,
    spam_count: Number,

});


let websiteSchema = new mongoose.Schema({

    alias: String,
    url: String,
    domains:[
        {
            name:String
        }
    ],
    contacts: [
        {
            alias: String,
            email: String
        }
    ],
    owner: String,
    forms:[formSchema],
    recaptcha:Boolean,
    secret:String,
    sitekey:String,
    messageCount:Number,
    httpsOnly:Boolean

});




let Website = mongoose.model('Website', websiteSchema);
let DeletionTask = mongoose.model('DeletionTask', deletionTaskSchema);

module.exports = {
    Website,DeletionTask
};