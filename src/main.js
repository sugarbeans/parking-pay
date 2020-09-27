import Vue from 'vue'
import App from './App.vue'
import UTIL from './util'
import router from "./router";
import store from "./store";
import "./http";
import scroll from './components/scroll'
Vue.use(scroll)
import Navbar from '@/components/Navbar.vue'
Vue.component('navbar',Navbar)

import { Dialog } from 'vant';
Vue.use(Dialog);
import { Notify } from 'vant';
Vue.use(Notify);
import {Overlay} from 'vant'
Vue.use(Overlay)

Vue.prototype.$UTIL = UTIL
Vue.config.productionTip = false

new Vue({
  router,
  store,
  UTIL,
  render: h => h(App),
}).$mount('#app')
