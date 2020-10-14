import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from "./store";
import "./assets/css/reset.css";
import "./http";
import scroll from './components/scroll'
Vue.use(scroll)
import Navbar from '@/components/Navbar.vue'
Vue.component('navbar',Navbar)

import { Dialog } from 'vant';
Vue.use(Dialog);
import { Toast } from 'vant';
Vue.use(Toast);
import {Overlay} from 'vant'
Vue.use(Overlay)
import { CellGroup, Field, Button, Picker, Popup} from 'vant';
Vue.use(CellGroup).use(Field).use(Button).use(Picker).use(Popup)
Vue.config.productionTip = false
Vue.prototype.$store = store;
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
