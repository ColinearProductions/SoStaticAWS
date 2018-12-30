<template>
    <div id="app">


        <Loader></Loader>
        <router-view></router-view>
        <MSnackBar></MSnackBar>
    </div>
</template>

<script>
    /* eslint-disable */
    import MSnackBar from "./components/TinyComponents/MSnackBar";

    import Layout from './components/Layout.vue'
    import Loader from './components/TinyComponents/Loader'
    import LandingPage from './components/LandingPage'
    import Vue from 'vue'
    import Vuex from "vuex";

    import * as api from './firebase_api';
    import firebase from 'firebase';

    Vue.use(Vuex);

    import router from './router'


    firebase.auth().onAuthStateChanged(function (user) {


        if (user) {
            store.commit('setLoggedInState', true);
            store.commit('setUser', user);

            console.log('Logged in', user);
            api.getWebsitesOfUser((snapshot) => {

                console.log('Websites count', snapshot.length);
                if (snapshot.length < 1) {
                    router.push('/setup');
                } else {
                    store.commit('setInitialData', snapshot);
                }

                store.commit('setLoaderVisibility', false)

            });
        } else {
            //user logged out
            store.commit('setLoggedInState', false);
            router.push('/');
            store.commit('setLoaderVisibility', false)

        }
    });


    const store = new Vuex.Store({
        state: {
            currentWebsite: '0',
            loaderVisible: true,
            isLoggedIn: false,
            isCreateWebsiteDialogVisible: false,
            snackbarVisible: false,
            snackbarText: '',
            websitesData: [{
                "alias": "Loading",
                "contacts": [],
                "httpsOnly": true,
                "owner": "",
                "recaptcha": false,
                "secret": "recaptcha secret",
                "sitekey": "recaptcha sitekey",
                "url": "loading.com",
                "key": "",
                "messagesCount": 128,
                "formsPercentage": 34,
                "messagesPercentage": 7,
                "forms": {}
            }],
            pendingModification: false,
            user: null,

        },
        mutations: {
            setInitialData(state, payload) {
                state.websitesData = payload
            },
            setLoggedInState(state, payload) {
                state.isLoggedIn = payload;
                if (payload === false)
                    state.user = null;
            },
            setUser(state, payload) {
                state.user = payload;
                console.log("USER JUST GOT SET");
            },
            updateCurrentWebsite(state, payload) {
                console.log(state, payload);
                state.currentWebsite = payload;
            },
            addWebsite(state, website) {
                state.websitesData.push(website);
                state.currentWebsite = state.websitesData.indexOf(website);


            },
            setPendingModification(state, pendingModification) {
                state.pendingModification = pendingModification;
            },
            setLoaderVisibility(state, visible) {
               state.loaderVisible = visible;

            },
            updateWebsiteData(state, website) {
                for (let i = 0; i < state.websitesData.length; i++) {
                    let w = state.websitesData[i];
                    console.log('Update Website Data');
                    console.log(website, w, website.key === w.key);
                    if (website.key === w.key) {
                        Vue.set(state.websitesData, i, website);
                    }


                }
                state.loaderVisible = false;
            },
            setCreateWebsiteDialogVisibility(state, visiblility) {
                state.isCreateWebsiteDialogVisible = visiblility
            },
            updateFormById(state, payload) {
                console.log("Trying to update local version of form", payload);
                let newAlias = payload.alias;
                let recaptcha = payload.recaptcha;
                let formId = payload.form_id;

                console.log(state.websitesData[state.currentWebsite].forms[formId]);
                state.websitesData[state.currentWebsite].forms[formId].alias = newAlias;
                state.websitesData[state.currentWebsite].forms[formId].recaptcha = recaptcha;
                state.loaderVisible = false;


            },
            removeForm(state, formId) {
                console.log("REMOVED FORM");
                Vue.delete(state.websitesData[state.currentWebsite].forms, formId);
                delete state.websitesData[state.currentWebsite].forms[formId];




                state.loaderVisible = false;


            },
            showSnackbar(state, text) {
                state.snackbarVisible = false;
                state.snackbarText = text;
                state.snackbarVisible = true;
            },
            hideSnackbar(state) {
                state.snackbarText = '';
                state.snackbarVisible = false;
            }

        },
        getters: {
            currentWebsiteClone: function (state) {
                console.log(state.websitesData[state.currentWebsite]);
                return JSON.parse(JSON.stringify(state.websitesData[state.currentWebsite]));
            },
            currentWebsite: function (state) {
                return state.websitesData[state.currentWebsite];
            },
            getPendingModification(state) {
                return state.pendingModification;
            },
            getLoaderVisible(state) {
                return state.loaderVisible;
            },
            getIsCreateWebsiteDialogVisible(state) {
                return state.isCreateWebsiteDialogVisible;
            },
            getIsLoggedIn(state) {
                return state.isLoggedIn
            },
            getSnackbarVisible(state) {
                return state.snackbarVisible;
            },
            getSnackbarText(state) {
                return state.snackbarText;
            },
            getUser(state) {
                console.log("TRYING TO GET USER");
                return state.user;
            }


        },
        actions: {
            createWebsite(context, website) {
                context.commit('setLoaderVisibility', true);
                console.log(website);
                api.addWebsite(website, function (snapshot) {
                    console.log(snapshot);
                    let newWebsiteKey = snapshot.key;
                    api.getWebsitesById(newWebsiteKey, function (snapshot) {
                        console.log("api.getWebsitesById(newWebsiteKey, function(snapshot)", snapshot);
                        context.commit('addWebsite', snapshot);
                        context.commit('setLoaderVisibility', false);
                        router.push('/app/settings');
                        context.commit('showSnackbar', 'Form ' + website.alias + ' created successfully');
                        context.commit('setCreateWebsiteDialogVisibility', false);

                    })
                })
            },
            addFormToWebsite(context, form) {
                context.commit('setLoaderVisibility', true);
                let current_website_key = context.getters.currentWebsite.key;

                api.addFormToWebsite(current_website_key, form, function (snapshot) {
                    console.log(snapshot);

                    api.getWebsitesById(current_website_key, function (snapshot) {
                        console.log(snapshot);
                        context.commit('updateWebsiteData', snapshot);
                        context.commit('showSnackbar', 'Form ' + form.alias + ' created successfully');


                    })
                })
            },
            updateWebsite(context, website) {
                context.commit('setLoaderVisibility', true);
                api.updateWebsite(website, () => {

                    context.commit('updateWebsiteData', JSON.parse(JSON.stringify(website)));
                    context.commit('setPendingModification', false);
                    context.commit('showSnackbar', 'Update webste ' + website.alias + ' successful');
                })

            },
            updateForm(context, data) {
                context.commit('setLoaderVisibility', true);
                let updateData = {alias: data.alias, recaptcha: data.recaptcha};

                let form_key = data.form_id;
                let current_website_key = context.getters.currentWebsite.key;

                api.updateForm(current_website_key, form_key, updateData, function () {
                    context.commit('updateFormById', data);

                });
            },
            deleteForm(context, formId) {
                context.commit('setLoaderVisibility', true);
                let websiteId = context.getters.currentWebsite.key;
                api.deleteForm(websiteId, formId, () => {
                    context.commit('removeForm', formId);

                })
            }

        }
    });


    router.beforeEach((to, from, next) => {
        if (store.getters.getPendingModification) {
            if(!store.getters.getIsLoggedIn) {
                next();
                return;
            }

            if (confirm('Do you want to proceed?')) {
                store.commit("setPendingModification", false);

                next();
            } else {

                next(false);
            }
        } else {
            next();
        }

    });

    export default {
        name: 'app',
        components: {
            MSnackBar,
            Layout, Loader, LandingPage
        },
        data: function () {
            return {
                s: store
            }
        },
        store
    }
</script>

<style>

</style>
