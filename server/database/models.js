let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

let formSchema = new mongoose.Schema({
    alias: String,
    recaptcha: Boolean,
    message_count: Number,
    spam_count: Number,

});


let websiteSchema = new mongoose.Schema({

    alias: String,
    url: String,
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

});




let Website = mongoose.model('Website', websiteSchema);

module.exports = {
    Website
};