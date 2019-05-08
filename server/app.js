const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const initMongoDB = require('./db').initDb;
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./firebase_pkey.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sostatic-aws.firebaseio.com"
});

const indexRouter = require('./routes/index.js');
const mockRouter = require('./routes/mock.js');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//this function will be called before every http request. Must be added as a middleware before mounting the routers
app.use((req,res,next)=>{
    console.log(req.body);
    let idToken = req.body.idToken;
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            console.log('Successfully validated token');
            res.token = decodedToken;
            next();
        }).catch(function(error) {
        console.error('ERROR:',error);
        res.send('Authentication error')
    });
});


app.use('/', indexRouter);
app.use('/mock', mockRouter);





const port = process.env.APP_PORT;

initMongoDB((mongoDb)=>{
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});


module.exports = app;
