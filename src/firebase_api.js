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


function register(user, pass, callback) {
    firebase.auth().createUserWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error);
        callback(error);
    });
}


function login(user, pass, callback) {
    firebase.auth().signInWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error);
        callback(error)
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
    form.message_count = 128;

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

function updateWebste(update_data, callback) {
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/websites/' + update_data.key).set(update_data).then(callback);
}



function pullMessages(websiteId, formId, start_date, end_date, callback) {
    console.log("pulling messages",websiteId,formId,new Date(start_date),new Date(end_date));




    let query = firebase.firestore().collection('messages')
      //  .where('userId', '==', firebase.auth().currentUser.uid)
     //   .where("addedOn", "<=", new Date(end_date))
      //  .where("addedOn", ">=",new Date(start_date))
     //   .where("websiteId", "==", websiteId);
   // if (formId !== "-1")
     //   query = query.where("formId", "==", formId);

    query.get().then((snapshot) => {

        let res = snapshot.docs.map((doc) => {
            let d = doc.data();
            d.key = doc.id;

            return d;
        });


        callback(res);
    });
}

/*
function pullMessages(start_date, end_date, websiteId, formId, showAmount, firstPageCallback, completeCallback) {

    let query = firebase.firestore().collection('messages')
        .where('userId', '==', firebase.auth().currentUser.uid)
        .where("addedOn", "<=", end_date)
        .where("addedOn", ">=", start_date)
        .where("websiteId", "==", websiteId);

    if (formId !== "-1")
        query = query.where("formId", "==", formId);

    query = query.orderBy("addedOn", "desc");


    if (showAmount > 0) {
        query = query.limit(showAmount);
    }


    query.get().then((snapshot) => {

        let res = snapshot.docs.map((doc) => {
            let d = doc.data();
            d.key = doc.id;

            return d;
        });

        firstPageCallback(res);
    });


} */


export {
    login,
    register,
    getWebsitesOfUser,
    addWebsite,
    logout,
    getWebsitesById,
    addFormToWebsite,
    updateForm,
    updateWebste,
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