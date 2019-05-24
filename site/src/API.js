/* eslint-disable */
import firebase from 'firebase'

import axios from 'axios';


const SERVER = process.env.NODE_ENV === 'development' ? 'http://localhost' : 'https://ssttc.xyz';


let config = {
    apiKey: "AIzaSyBFmN3pKDKU5weY2Vvn9ZYWBZxpkJTRjKA",
    authDomain: "sostatic-aws.firebaseapp.com",
    databaseURL: "https://sostatic-aws.firebaseio.com",
    projectId: "sostatic-aws",
    storageBucket: "",
    messagingSenderId: "1045757408696"
};

firebase.initializeApp(config);


function logout(callback) {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
        callback()
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



function getWebsitesOfUser() {
    return axios.get(`${SERVER}/websites`);
}

function updateWebsite(websiteData) {


    let websiteId = websiteData._id;


    return axios.post(`${SERVER}/websites/${websiteId}`, websiteData);

}


function getWebsitesById(id, callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + id).once('value').then(function (snapshot) {
        let website = snapshot.val();
        website.key = snapshot.key;
        callback(website);
    })
}


function createWebsite(website) {
    return axios.post(`${SERVER}/websites`, website)
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




function pullMessages(websiteId, formId, start_date, end_date, onlyValid, page, items_per_page) {


    return axios.get(`${SERVER}/messages/list`,
        {
            params: {
                start: start_date,
                end: end_date,
                only_valid: onlyValid,
                form_id: formId,
                website_id: websiteId,
                page: page,
                items_per_page: items_per_page
            }
        }
    );

}


export {
    login,
    register,
    getWebsitesOfUser,
    createWebsite,
    logout,
    getWebsitesById,
    addFormToWebsite,
    updateForm,
    deleteForm,
    updateWebsite,
    pullMessages,
    SERVER
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