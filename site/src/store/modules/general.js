const state = {
    loaderVisible: false,
    isLoggedIn: false,
    isCreateWebsiteDialogVisible: false,
    snackbarVisible: false,
    snackbarText: '',
    pendingModification: false,
    user: null,
    userToken: null
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
        console.log("TRYING TO GET USER");
        return state.user;
    },

    getIdToken(state) {
        return state.userToken
    }

};

const actions = {

};



export default {
    state,
    getters,
    mutations,
    actions
}