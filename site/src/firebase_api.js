
/* eslint-disable */
import firebase from 'firebase'


const axios = require('axios');


let  config = {
    apiKey: "AIzaSyBFmN3pKDKU5weY2Vvn9ZYWBZxpkJTRjKA",
    authDomain: "sostatic-aws.firebaseapp.com",
    databaseURL: "https://sostatic-aws.firebaseio.com",
    projectId: "sostatic-aws",
    storageBucket: "",
    messagingSenderId: "1045757408696"
};

firebase.initializeApp(config);


function logout() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}


function register(displayName, email, password, onSuccessCallback, onErrorCallback) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        let user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: '' + displayName
        }).then(() => onSuccessCallback())

    }).catch(function (error) {
        onErrorCallback(error.code, error.message);
    });
}


function login(user, pass, onSuccessCallback, onErrorCallback) {
    firebase.auth().signInWithEmailAndPassword(user, pass).then(function () {
        onSuccessCallback();
    }).catch(function (error) {
        console.log('Login error', error);
        onErrorCallback(error)
    });
}

function getWebsitesOfUser(callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites').once('value').then(function (snapshot) {
        callback(snapshotToArray(snapshot));
    })
}

function getWebsitesById(id, callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + id).once('value').then(function (snapshot) {
        let website = snapshot.val();
        website.key = snapshot.key;
        callback(website);
    })
}


function addWebsite(website, callback) {

    let uid = firebase.auth().currentUser.uid;
    firebase.database().ref(`/users/${uid}/websites`).push(website).then(callback);
}


function addFormToWebsite(website_id, form, callback) {
    form.added_on = firebase.database.ServerValue.TIMESTAMP;
    form.message_count = 0;
    form.spam_count = 0;

    //don't worry if the keys are very similar.

    let futureFormRef = firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + website_id + "/forms").push();
    form.key = futureFormRef.key;

    let endpointData = {form: form.key, website: website_id, user: firebase.auth().currentUser.uid};
    let futureEndpointRef = firebase.database().ref('/endpoints').push();

    form.endpoint = futureEndpointRef.key;

    futureFormRef.set(form).then((snapshot) => {
        futureEndpointRef.set(endpointData).then(console.log);
        callback(snapshot);
    });

    // let res = firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites/'+website_id+"/forms").push(form).then(callback);
}

function updateForm(websiteId, form_key, update_data, callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + websiteId + "/forms/" + form_key)
        .update(update_data).then(function () {

        callback();
    });
}

function deleteForm(websieId, formId, callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + websieId + '/forms/' + formId).remove().then(() => {
        callback();
    }).catch((reason) => {
        console.error(reason);
    })
}


function updateWebsite(update_data, callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + update_data.key).set(update_data).then(callback);
}


function pullMessages(websiteId, formId, start_date, end_date, onlyValid, callback) {
    console.log("pulling messages");


    axios.get("http://localhost:3001/list",
        {
            params: {
                start: start_date,
                end: end_date,
                only_valid: onlyValid,
                form_id: formId,
                website_id: websiteId
            }
        }).then((response) => {
        console.log(response);
        callback(response.data);
    }).catch(function (error) {
        console.log(error);
    });

}


export {
    login,
    register,
    getWebsitesOfUser,
    addWebsite,
    logout,
    getWebsitesById,
    addFormToWebsite,
    updateForm,
    deleteForm,
    updateWebsite,
    pullMessages
}


function snapshotToArray(snapshot) {
    let returnArr = [];

    console.log(typeof snapshot);

    snapshot.forEach(function (childSnapshot) {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;


        returnArr.push(item);
    });

    return returnArr;
}