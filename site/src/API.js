
import firebase from 'firebase'
import axios from 'axios'
const SERVER = process.env.NODE_ENV === 'development' ? 'http://localhost:12345' : 'https://ssttc.xyz'
axios.defaults.baseURL = SERVER

let config = {
    apiKey: 'AIzaSyBFmN3pKDKU5weY2Vvn9ZYWBZxpkJTRjKA',
    authDomain: 'sostatic-aws.firebaseapp.com',
    databaseURL: 'https://sostatic-aws.firebaseio.com',
    projectId: 'sostatic-aws',
    storageBucket: '',
    messagingSenderId: '1045757408696'
}

firebase.initializeApp(config)

function logout () {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out')
        window.location.href = '/'
    }, function (error) {
        console.error('Sign Out Error', error)
    })
}

function register (email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
}

function login (user, pass) {
    return firebase.auth().signInWithEmailAndPassword(user, pass)
}

function sendRecoveryEmail (email) {
    return firebase.auth().sendPasswordResetEmail(email)
}

function getWebsitesOfUser () {
    return axios.get(`/api/websites`)
}

function createWebsite (website) {
    return axios.post(`/api/websites`, website)
}

function deleteWebsite (websiteid) {
    return axios.delete(`/api/websites/${websiteid}`)
}

function updateWebsite (websiteData) {
    return axios.post(`/api/websites/${websiteData._id}`, websiteData)
}

function addFormToWebsite (website_id, form) {
    return axios.post(`/api/websites/${website_id}/forms`, form)
}

function updateForm (websiteId, form_key, update_data) {
    return axios.post(`/api/websites/${websiteId}/forms/${form_key}`, update_data)
}

function deleteForm (websieId, formId) {
    return axios.delete(`/api/websites/${websieId}/forms/${formId}`)
}

function deleteAccount () {
    return axios.post(`/api/users/deletion_task`)
}

function getDeletionPending () {
    return axios.get(`/api/users/deletion_task`)
}
function cancelDeletion () {
    return axios.delete(`/api/users/deletion_task`)
}

function pullMessages (websiteId, formId, start_date, end_date, onlyValid, page, items_per_page) {
    return axios.get(`/api/messages/list`,
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
    )
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
    sendRecoveryEmail,
    SERVER
}
