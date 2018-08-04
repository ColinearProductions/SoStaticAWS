import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate';


import 'vuetify/dist/vuetify.min.css'

import Vuetify from 'vuetify'

import VueHighlightJS from 'vue-highlightjs'



Vue.use(Vuetify, {
        theme: {
            primary: "#5E35B1",
            secondary: "#7E57C2",
            accent: "#7E57C2",
            error: "#f44336",
            warning: "#ffeb3b",
            info: "#5cf32d",
            success: "#4caf50"
        }
    }
);

Vue.use(VueHighlightJS);
Vue.use(VeeValidate);

Vue.config.productionTip = false;


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
