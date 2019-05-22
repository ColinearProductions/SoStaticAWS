import Vue from 'vue'
import Vuex from 'vuex';
import websitesModule from './modules/websites'
import generalModule from './modules/general'


Vue.use(Vuex);


export default new Vuex.Store({
        modules: {
            websites: websitesModule,
            general: generalModule
        }
    }
)