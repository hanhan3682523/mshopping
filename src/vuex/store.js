import Vue from 'vue'
import Vuex from 'vuex'
import index from './modules/index'
import my from './modules/my'
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        index,
        my
    }
});
