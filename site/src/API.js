
import firebase from 'firebase'
import axios from 'axios';
const SERVER = process.env.NODE_ENV === 'development' ? 'http://34.65.200.188:12345' : 'http://34.65.200.188:12345';


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

function createWebsite(website) {
    return axios.post(`${SERVER}/websites`, website)
}

function deleteWebsite(websiteid){
    return axios.delete(`${SERVER}/websites/${websiteid}`)
}

function updateWebsite(websiteData) {
    return axios.post(`${SERVER}/websites/${ websiteData._id}`, websiteData);
}


function addFormToWebsite(website_id, form) {
    return axios.post(`${SERVER}/websites/${website_id}/forms`, form)
}

function updateForm(websiteId, form_key, update_data) {
    return axios.post(`${SERVER}/websites/${websiteId}/forms/${form_key}`, update_data);
}

function deleteForm(websieId, formId) {
    return axios.delete(`${SERVER}/websites/${websieId}/forms/${formId}`);
}

function deleteAccount(){
    return axios.post(`${SERVER}/users/deletion_task`)
}

function getDeletionPending(){
    return axios.get(`${SERVER}/users/deletion_task`)
}
function cancelDeletion(){
    return axios.delete(`${SERVER}/users/deletion_task`)
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
    addFormToWebsite,
    updateForm,
    deleteForm,
    updateWebsite,
    pullMessages,
    deleteAccount,
    getDeletionPending,
    cancelDeletion,
    deleteWebsite,
    SERVER
}