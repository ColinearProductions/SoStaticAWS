import * as api from "../../API";

const state = {
    loaderVisible: false,
    isLoggedIn: false,
    isCreateWebsiteDialogVisible: false,
    snackbarVisible: false,
    snackbarText: '',
    pendingModification: false,
    user: null,
    userToken: null,
    deletion: {
        pending: false,
        timestamp: null,
    }
};

const mutations = {

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


    setPendingModification(state, pendingModification) {
        state.pendingModification = pendingModification;
    },
    setLoaderVisibility(state, visible) {
        state.loaderVisible = visible;
    },

    setCreateWebsiteDialogVisibility(state, visibility) {
        state.isCreateWebsiteDialogVisible = visibility
    },
    showSnackbar(state, text) {
        state.snackbarVisible = false;
        state.snackbarText = text;
        state.snackbarVisible = true;
    },
    hideSnackbar(state) {
        state.snackbarText = '';
        state.snackbarVisible = false;
    },
    setDeletionPending(state, value) {

        state.deletion.pending = value.pending;
        state.deletion.timestamp = value.timestamp;
    }
};

const getters = {
    getPendingModification(state) {
        return state.pendingModification;
    },

    getLoaderVisible(state) {
        return state.loaderVisible;
    },
    getIsCreateWebsiteDialogVisible(state) {
        return state.isCreateWebsiteDialogVisible;
    },
    isLoggedIn(state) {
        return state.isLoggedIn
    },
    getSnackbarVisible(state) {
        return state.snackbarVisible;
    },
    getSnackbarText(state) {
        return state.snackbarText;
    },
    getUser(state) {
        return state.user;
    },

    getIdToken(state) {
        return state.userToken
    },
    getDeletionPending(state) {
        return state.deletion.pending
    },
    getDeletionTimeout(state) {
        return state.deletion.timestamp
    }

};


const actions = {

    updateDeletionPending: (context) => {
        api.getDeletionPending()
            .then(result => {
                context.commit('setDeletionPending', {pending: true, timestamp: result.data.timestamp});
                context.commit('showSnackbar','Your account is pending deletion.')
            }).catch(error => {
            if (error.response.status === 404)
                context.commit('setDeletionPending', {pending: false, timestamp: null});

        })
    },
    cancelDeletion:(context)=>{
        api.cancelDeletion()
            .then(result => {
                context.commit("showSnackbar", "Account deletion countdown has been stopped");
                context.commit('setDeletionPending', {pending: false, timestamp: null});
            }).catch(error => {
            console.log(error);
        });
    },
    beginDeletion:(context)=>{
        api.deleteAccount()
            .then(result => {
                context.commit("showSnackbar", "Countdown towards account deletion has started");
                context.commit('setDeletionPending', {pending: true, timestamp: result.data.timestamp});

            }).catch(error => {
            console.log(error);
        })
    }
};


export default {
    state,
    getters,
    mutations,
    actions
}