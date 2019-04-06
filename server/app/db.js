

let mongoDB;
let MongoClient = require('mongodb').MongoClient;


function initDb(onSuccess){
    //db is mapped in hosts to localhost. in docker to the network shared with the mongo container
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
