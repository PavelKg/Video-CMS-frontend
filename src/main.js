import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import i18n from './i18n';
import dirClickOutside from './directive/click-outside.js'
import closable from './directive/closable.js'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'video.js/dist/video-js.css'

Vue.directive('closable', closable)
Vue.use(BootstrapVue)

require('es6-promise').polyfill()
Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
