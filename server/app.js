let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let bodyParser = require('body-parser');
let indexRouter = require('./routes/index');
let mockRouter = require('./routes/mock');

const initMongoDB = require('./db').initDb;


let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/mock', mockRouter);

const port = 3001;

initMongoDB((mongoDb)=>{
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});


module.exports = app;
