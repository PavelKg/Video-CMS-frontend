import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import VueI18n from 'vue-i18n'
import messages from './store/i18n/messages'
import dirClickOutside from './directive/click-outside.js'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: messages, // set locale messages
  silentTranslationWarn: true
})

Vue.directive('click-outside', dirClickOutside)

require('es6-promise').polyfill()
Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
