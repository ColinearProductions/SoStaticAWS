import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VeeValidate from 'vee-validate'

import 'vuetify/dist/vuetify.min.css'

import VueHighlightJS from 'vue-highlightjs'
import VuetifyConfirm from 'vuetify-confirm'
import Vuetify from 'vuetify/lib'
import Router from 'vue-router'


Vue.use(VueHighlightJS);
Vue.use(VeeValidate);
Vue.use(VuetifyConfirm, { color: 'red', width: 700 });
Vue.use(Router);
Vue.config.productionTip = false;

const vuetifyOptions = {
    icons:{
        iconfont:'md'
    },
    theme: {
        dark: false,
        themes: {
            light: {
                primary: '#5E35B1',
                secondary: '#7E57C2',
                accent: '#7E57C2',
                error: '#f44336',
                warning: '#ffeb3b',
                info: '#5cf32d',
                success: '#4caf50'
            }
        }

    }
};
Vue.use(Vuetify);

new Vue({
    vuetify: new Vuetify(vuetifyOptions),
    router,
    render: h => h(App)
}).$mount('#app');
