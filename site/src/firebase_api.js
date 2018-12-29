import firebase from 'firebase'
import 'firebase/firestore';

const settings = {/* your settings... */ timestampsInSnapshots: true};


let config = {
    apiKey: "AIzaSyDOpoNcoeSWE8weaKuT8DvMWt2qSTok11k",
    authDomain: "sostatic-1d381.firebaseapp.com",
    databaseURL: "https://sostatic-1d381.firebaseio.com",
    projectId: "sostatic-1d381",
    storageBucket: "sostatic-1d381.appspot.com",
    messagingSenderId: "446439468118"
};

firebase.initializeApp(config);
firebase.firestore().settings(settings);


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
            displayName: ''+displayName
        }).then(() => onSuccessCallback())

    }).catch(function (error) {
        onErrorCallback(error.code, error.message);
    });
}


function login(user, pass,onSuccessCallback, onErrorCallback) {
    firebase.auth().signInWithEmailAndPassword(user, pass).then(function(){
        onSuccessCallback();
    }).catch(function (error) {
        console.log('Login error',error);
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
    website.messagesCount = 0;
    website.formsCount = 0;
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites').push(website).then(callback);
}


function addFormToWebsite(website_id, form, callback) {
    form.added_on = firebase.database.ServerValue.TIMESTAMP;
    form.message_count = 0;

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

function deleteForm(websieId, formId, callback){
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites/'+websieId+'/forms/'+formId).remove().then(()=>{
        callback();
    }).catch((reason)=>{
        console.error(reason);
    })
}




function updateWebsite(update_data, callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + update_data.key).set(update_data).then(callback);
}


function pullMessages(websiteId, form_id, start_date, end_date, only_valid, callback) {
    console.log("pulling messages");

    start_date = new Date(start_date);
    end_date = new Date(end_date);
    end_date.setDate(end_date.getDate() + 1);

    console.log(start_date);
    console.log(end_date);

    console.log(firebase.auth().currentUser.uid);
    let query = firebase.firestore().collection('messages')
        .where('userId', '==', firebase.auth().currentUser.uid)
        .where("timestamp", "<=", end_date)
        .where("timestamp", ">=", start_date)
        .where("website_id", "==", websiteId);


    if (only_valid)
        query = query.where("valid", "==", only_valid);


    if (form_id != -1)
        query = query.where("formId", "==", form_id);

    query.get().then((snapshot) => {

        let res = snapshot.docs.map((doc) => {
            let d = doc.data();
            d.key = doc.id;

            return d;
        });


        callback(res);
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