// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css'
import App from './App'
import router from './router'
import store from './vuex/store'
import VueJsonp from 'vue-jsonp'
import { get, post } from './utils/http'

Vue.config.productionTip = false;
//jsonp访问
Vue.use(VueJsonp);
//组件UI
Vue.use(YDUI);
//定义全局变量
Vue.prototype.$get = get;
Vue.prototype.$post = post;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
