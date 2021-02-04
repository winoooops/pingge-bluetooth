import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vconsole from 'vconsole'
import router from './router'
import wx from 'weixin-js-sdk';

let vConsole = new Vconsole()
Vue.use(vConsole)





// const wx = window.wx
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.wx = wx
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
