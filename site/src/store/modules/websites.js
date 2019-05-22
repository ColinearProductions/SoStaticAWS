import Vue from 'vue'
import * as api from '../../API';
import router from './router'


const state = {
    isInitialDataLoading: true,
    currentWebsite: 0,
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
};


const mutations = {
    setInitialData: (state, payload) => {
        state.currentWebsite = payload.websiteIndex;
        state.websitesData = payload.websites;
        state.isInitialDataLoading = false;
    },
    updateCurrentWebsite: (state, payload) => {

        state.currentWebsite = payload;
    },
    addWebsite: (state, website) => {
        state.websitesData.push(website);
        state.currentWebsite = state.websitesData.indexOf(website);
    },
    updateWebsiteData: (state, website) => {
        for (let i = 0; i < state.websitesData.length; i++) {
            let w = state.websitesData[i];

            if (website.key === w.key) {
                Vue.set(state.websitesData, i, website);
            }
        }
        state.loaderVisible = false;
    },

    updateFormById: (state, payload) => {
        let newAlias = payload.alias;
        let recaptcha = payload.recaptcha;
        let formId = payload.form_id;
        state.websitesData[state.currentWebsite].forms[formId].alias = newAlias;
        state.websitesData[state.currentWebsite].forms[formId].recaptcha = recaptcha;
        state.loaderVisible = false;
    },

    removeForm: (state, formId) => {
        Vue.delete(state.websitesData[state.currentWebsite].forms, formId);
        delete state.websitesData[state.currentWebsite].forms[formId];


        state.loaderVisible = false;


    },
};


const getters = {
    currentWebsiteClone: (state) => {
        console.log("THIIIIIIIIIIIIS", state.currentWebsite);
        return JSON.parse(JSON.stringify(state.websitesData[state.currentWebsite]));
    },
    currentWebsite: (state) => {
        console.log(state);
        return state.websitesData[state.currentWebsite];
    },
    isDataLoading: (state) => {
        return state.isInitialDataLoading;
    },
    websites: (state) => {
        return state.websitesData;
    },


};

const actions = {
    createWebsite: (context, website) => {
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
    addFormToWebsite: (context, form) => {
        let current_website_key = context.getters.currentWebsite.key;

        api.addFormToWebsite(current_website_key, form, function () {

            api.getWebsitesById(current_website_key, function (snapshot) {
                context.commit('updateWebsiteData', snapshot);
                context.commit('showSnackbar', 'Form ' + form.alias + ' created successfully');


            })
        })
    },
    updateWebsite: (context, website) => {
        api.updateWebsite(website, () => {

            context.commit('updateWebsiteData', JSON.parse(JSON.stringify(website)));
            context.commit('setPendingModification', false);
            context.commit('showSnackbar', 'Update website ' + website.alias + ' successful');
        })

    },
    updateForm: (context, data) => {
        let updateData = {alias: data.alias, recaptcha: data.recaptcha};

        let form_key = data.form_id;
        let current_website_key = context.getters.currentWebsite.key;

        api.updateForm(current_website_key, form_key, updateData, function () {
            context.commit('updateFormById', data);

        });
    },
    deleteForm: (context, formId) => {
        let websiteId = context.getters.currentWebsite.key;
        api.deleteForm(websiteId, formId, () => {
            context.commit('removeForm', formId);

        })
    }
};

export default {
    state,
    getters,
    mutations,
    actions
}