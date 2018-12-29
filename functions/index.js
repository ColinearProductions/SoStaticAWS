const functions = require('firebase-functions');
let admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
let db = admin.database();

const onUserCreated = functions.auth.user().onCreate((user) => {
    console.log(user);
    let blankUser = {
        websites: [],
        messages: [],
        email: user.email
    };


    return db.ref('/users/' + user.uid).set(blankUser).then((resp) => console.log("RESP: " + resp));

});

module.exports = {
    onUserCreated
};
