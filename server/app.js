require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const initMongoDB = require('./database/db').initDb;
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./firebase_pkey.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sostatic-aws.firebaseio.com"
});

const messagesRouter = require('./routes/messages.js');
const endpointRouter = require('./routes/endpoint.js');
const websitesRouter = require('./routes/websites.js');
const usersRouter = require('./routes/users.js');
const mockRouter = require('./routes/mock.js');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



app.use('/api/messages', messagesRouter);
app.use('/', endpointRouter);
app.use('/api/mock', mockRouter);
app.use('/api/websites', websitesRouter);
app.use('/api/users', usersRouter);





const port = process.env.APP_PORT;

initMongoDB((mongoDb)=>{

    app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}!`));
});


module.exports = app;
