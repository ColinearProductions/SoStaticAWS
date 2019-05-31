


let mongoDB;
let mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
let db_url = process.env.DB_ADDRESS;


function initDb(onSuccess){
    //db is mapped in hosts to localhost. in docker to the network shared with the mongo container

    mongoose.connect('mongodb://'+db_url+'/sostatic', {useNewUrlParser: true});
    mongoDB = mongoose.connection;
    mongoDB.on('error', console.error.bind(console, 'connection error:'));
    mongoDB.once('open', ()=> {
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
