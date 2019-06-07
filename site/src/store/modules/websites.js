import Vue from 'vue'
import * as api from '../../API';
import router from '../../router'


const state = {
    isInitialDataLoading: true,
    currentWebsiteIndex: 0,
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
        state.currentWebsiteIndex = payload.websiteIndex;
        state.websitesData = payload.websites;
        state.isInitialDataLoading = false;
    },
    updateCurrentWebsiteIndex: (state, payload) => {

        state.currentWebsiteIndex = payload;
    },
    addWebsite: (state, website) => {
        state.websitesData.push(website);
        state.currentWebsiteIndex = state.websitesData.length - 1;
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
        state.websitesData[state.currentWebsiteIndex].forms[formId].alias = newAlias;
        state.websitesData[state.currentWebsiteIndex].forms[formId].recaptcha = recaptcha;
        state.loaderVisible = false;
    },

    removeForm: (state, formId) => {


        let forms =  state.websitesData[state.currentWebsiteIndex].forms;
        console.log("Removing forms");
        console.log(forms);

        let formIndex = forms.findIndex(form=>form._id===formId);
        console.log('target index', formIndex);

        forms.splice(formIndex,1)




    },
};


const getters = {
    currentWebsiteClone: (state) => {
        return JSON.parse(JSON.stringify(state.websitesData[state.currentWebsiteIndex]));
    },
    currentWebsite: (state) => {
        return state.websitesData[state.currentWebsiteIndex];
    },
    isDataLoading: (state) => {
        return state.isInitialDataLoading;
    },
    websites: (state) => {
        return state.websitesData;
    },
    currentWebsiteIndex: (state)=>{
        return state.currentWebsiteIndex;
    }


};

const actions = {
    init: (context) => {
        api.getWebsitesOfUser().then(response => {

            let websitesCount = response.data.length;
            let websiteIndex = parseInt(router.currentRoute.params.website_index);

            if (isNaN(websiteIndex) || websiteIndex + 1 > websitesCount)
                websiteIndex = 0;

            if (router.currentRoute.path !== '/') {
                router.push({
                    params: {
                        'website_index': websiteIndex
                    }
                });
                if (websitesCount < 1)
                    router.push('/setup');
            }

            let payload = {
                websiteIndex,
                websites: response.data,

            };
            context.commit('setInitialData', payload);


        });

    },
    createWebsite: (context, website) => {
        console.log(website);

        api.createWebsite(website).then(response => {

            context.commit('addWebsite', response.data);

            router.push({
                name: 'Settings',
                params: {
                    'website_index': context.state.currentWebsiteIndex
                }
            });


            context.commit('showSnackbar', 'Form ' + website.alias + ' created successfully');

            context.commit('setCreateWebsiteDialogVisibility', false);


        }).catch((reason) => {

            console.log(reason);
        })
    },
    deleteWebsite: (context, websiteId) => {
        context.commit('setLoaderVisibility', true);

        api.deleteWebsite(websiteId)
            .then(result => {

                context.dispatch('init', null, {root: true});
                context.commit('showSnackbar', 'Website successfully deleted. All data associated with the website has been deleted from our servers');
                context.commit('setLoaderVisibility', false);
            }).catch(error => {
            console.log(error);
        })
    },
    addFormToWebsite: (context, form) => {
        let current_website_key = context.getters.currentWebsiteClone._id;

        api.addFormToWebsite(current_website_key, form)
            .then(response => {

                    context.commit('updateWebsiteData', response.data);
                    context.commit('showSnackbar', 'Form ' + form.alias + ' created successfully');

                }
            );


    },
    updateWebsite: (context, website) => {

        api.updateWebsite(website).then(() => {
            context.commit('updateWebsiteData', website);
            context.commit('setPendingModification', false);
            context.commit('showSnackbar', 'Update website ' + website.alias + ' successful');
        })

    },
    updateForm: (context, data) => {
        let updateData = {alias: data.alias, recaptcha: data.recaptcha};

        let form_key = data.form_id;
        let current_website_key = context.getters.currentWebsiteClone._id;

        api.updateForm(current_website_key, form_key, updateData).then(response => {
            context.commit('updateWebsiteData', response.data);
            context.commit('showSnackbar', 'Update form successful');


        });
    },
    deleteForm: (context, formId) => {


        let websiteId = context.getters.currentWebsite._id;

        console.log(context.getters.currentWebsite._id);
        console.log(formId);



        api.deleteForm(websiteId, formId).then(() => {
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