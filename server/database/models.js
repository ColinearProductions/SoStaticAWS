let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

let formSchema = new mongoose.Schema({
    alias: String,
    recaptcha: Boolean,
    added_on: Date,
    messages_count: Number,
    spam_count: Number,
    endpoint: String,

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
    forms: [
        formSchema
    ]
});

websiteSchema.query.byIdAndOwner = function(id,owner){
  return this.where({owner:owner,_id:id})
};

let Website = mongoose.model('Website', websiteSchema);

module.exports = {
    Website
};