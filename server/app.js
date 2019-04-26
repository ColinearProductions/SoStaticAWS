let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');
let bodyParser = require('body-parser');
let indexRouter = require('./routes/index.js');
//let websitesRouter = require('./routes/websites.js');
let mockRouter = require('./routes/mock.js');



const initMongoDB = require('./db').initDb;





let app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/mock', mockRouter);
//app.use('/websites', websitesRouter);




const port = process.env.APP_PORT;

initMongoDB((mongoDb)=>{
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});


module.exports = app;
