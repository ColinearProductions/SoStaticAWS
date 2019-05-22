<template>
    <div id="app">


        <Loader></Loader>
        <router-view></router-view>
        <MSnackBar></MSnackBar>
    </div>
</template>

<script>
    /* eslint-disable */
    import MSnackBar from './components/TinyComponents/MSnackBar';

    import Layout from './components/Layout.vue'
    import Loader from './components/TinyComponents/Loader'
    import LandingPage from './components/LandingPage'
    import Vue from 'vue'
    import Vuex from 'vuex';

    import * as api from './API';
    import firebase from 'firebase';
    import axios from 'axios';


    import router from './router'

    import store from './store'


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
            console.log(idToken);
            let tmp = {
                user: user,
                token: idToken
            };
            store.commit('setUserData', tmp);

            //add auth header to all requests
            axios.defaults.headers.common['Authorization'] =  "Bearer " + idToken;




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


    router.beforeEach((to, from, next) => {
        if (store.getters.getPendingModification) {
            if (!store.getters.isLoggedIn) {
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


    console.log(store);

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
        store:store
    }
</script>

<style>

</style>
