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

    import * as api from './API';
    import firebase from 'firebase';

    Vue.use(Vuex);

    import router from './router'


    firebase.auth().onAuthStateChanged(function (user) {
        if (user !== null) {
            onLoggedIn(user)

        } else {
            //user logged out
            store.commit('setLoggedInState', false);
            router.push('/');

        }
    });


    function onLoggedIn(user) {

        //will generate a new token, true=force refresh
        firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
            let tmp = {
                user: user,
                token: idToken
            };
            store.commit('setUserData', tmp);
        }).catch(error => console.error(error));


        api.getWebsitesOfUser((snapshot) => {

            console.log('Websites count', snapshot.length);


            let websiteIndex = parseInt(router.currentRoute.params.website_index);
            if (isNaN(websiteIndex) || websiteIndex + 1 > snapshot.length)
                websiteIndex = 0;

            if (router.currentRoute.path !== '/') {
                router.push(
                    {
                        params: {
                            'website_index': websiteIndex
                        }
                    });
                if (snapshot.length < 1)
                    router.push('/setup');
            }

            let payload = {
                websiteIndex,
                websites: snapshot,

            };
            store.commit('setInitialData', payload);


        });
    }


    const store = new Vuex.Store({
        state: {
            currentWebsite: 0,
            loaderVisible: false,
            isLoggedIn: false,
            isCreateWebsiteDialogVisible: false,
            snackbarVisible: false,
            snackbarText: '',
            websitesData: [{
                "alias": "",
                "contacts": [],
                "httpsOnly": true,
                "owner": "",
                "recaptcha": false,
                "secret": "",
                "sitekey": "",
                "url": "",
                "key": "",
                "messagesCount": 128,
                "formsPercentage": 34,
                "messagesPercentage": 7,
                "forms": {}
            }],
            isInitialDataLoading: true,
            pendingModification: false,
            user: null,
            userToken: null

        },
        mutations: {
            setInitialData(state, payload) {
                console.log('Setting initial data');
                console.log(payload);
                state.currentWebsite = payload.websiteIndex;
                state.websitesData = payload.websites;
                state.isInitialDataLoading = false;
            },
            setLoggedInState(state, payload) {
                state.isLoggedIn = payload;
                if (payload === false)
                    state.user = null;
            },
            setUserData(state, payload) {

                state.isLoggedIn = true;
                state.userToken = payload.token;
                state.user = payload.user;
            },
            updateCurrentWebsite(state, payload) {

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
                let newAlias = payload.alias;
                let recaptcha = payload.recaptcha;
                let formId = payload.form_id;

                state.websitesData[state.currentWebsite].forms[formId].alias = newAlias;
                state.websitesData[state.currentWebsite].forms[formId].recaptcha = recaptcha;
                state.loaderVisible = false;


            },
            removeForm(state, formId) {
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
                console.log("THIIIIIIIIIIIIS", state.currentWebsite);
                return JSON.parse(JSON.stringify(state.websitesData[state.currentWebsite]));
            },
            currentWebsite: function (state) {
                console.log(state);
                return state.websitesData[state.currentWebsite];
            },
            getPendingModification(state) {
                return state.pendingModification;
            },
            isDataLoading(state) {
                return state.isInitialDataLoading;
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
            },
            getWebsitesCount(state) {
                return state.websitesData.length;
            }


        },
        actions: {
            createWebsite(context, website) {
                console.log(website);
                website.forms = {};
                api.addWebsite(website, function (snapshot) {
                    console.log(snapshot);
                    let newWebsiteKey = snapshot.key;
                    api.getWebsitesById(newWebsiteKey, function (snapshot) {
                        context.commit('addWebsite', snapshot);
                        router.push('/app/settings');
                        context.commit('showSnackbar', 'Form ' + website.alias + ' created successfully');
                        context.commit('setCreateWebsiteDialogVisibility', false);

                    })
                })
            },
            addFormToWebsite(context, form) {
                let current_website_key = context.getters.currentWebsite.key;

                api.addFormToWebsite(current_website_key, form, function (snapshot) {

                    api.getWebsitesById(current_website_key, function (snapshot) {
                        context.commit('updateWebsiteData', snapshot);
                        context.commit('showSnackbar', 'Form ' + form.alias + ' created successfully');


                    })
                })
            },
            updateWebsite(context, website) {
                api.updateWebsite(website, () => {

                    context.commit('updateWebsiteData', JSON.parse(JSON.stringify(website)));
                    context.commit('setPendingModification', false);
                    context.commit('showSnackbar', 'Update webste ' + website.alias + ' successful');
                })

            },
            updateForm(context, data) {
                let updateData = {alias: data.alias, recaptcha: data.recaptcha};

                let form_key = data.form_id;
                let current_website_key = context.getters.currentWebsite.key;

                api.updateForm(current_website_key, form_key, updateData, function () {
                    context.commit('updateFormById', data);

                });
            },
            deleteForm(context, formId) {
                let websiteId = context.getters.currentWebsite.key;
                api.deleteForm(websiteId, formId, () => {
                    context.commit('removeForm', formId);

                })
            }

        }
    });


    router.beforeEach((to, from, next) => {
        if (store.getters.getPendingModification) {
            if (!store.getters.getIsLoggedIn) {
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
        computed:{
            vtf:function () {
                return this.$vuetify
            }
        },
        store
    }
</script>

<style>

</style>
