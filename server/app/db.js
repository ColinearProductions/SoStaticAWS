

let mongoDB;
let MongoClient = require('mongodb').MongoClient;


function initDb(onSuccess){
    MongoClient.connect('mongodb://db:27017/sostatic', { useNewUrlParser: true }, function (err, client) {
        if (err) throw err;
        mongoDB = client.db('sostatic');
        onSuccess(mongoDB)
    });
}


function getDb(){
    return mongoDB;
}



module.exports = {
    getDb,
    initDb
};
