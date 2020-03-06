//this function will be called before every http request. Must be added as a middleware before mounting the routers
const admin = require('firebase-admin');


let middleware = (req, res, next) => {


    if(req.headers.authorization===undefined &&  process.env.NODE_ENV === 'development') {
        req.token = {uid:'wYtMsrGz0XYidppAFmXTX5TSL8c2'};
        next();
        return
    }


    let idToken = req.headers.authorization.split(' ')[1]; //todo error handling


    admin.auth().verifyIdToken(idToken)
        .then(function (decodedToken) {
            req.token = decodedToken;
            next();
        })
        .catch(function (error) {
            console.error('ERROR:', error);
            res.send('Authentication error')
        });

};

module.exports = middleware;