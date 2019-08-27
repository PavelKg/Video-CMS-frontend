import '@babel/polyfill'
//import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import i18n from './i18n'
import dirClickOutside from './directive/click-outside.js'
import closable from './directive/closable.js'
import BootstrapVue from 'bootstrap-vue'
import Multiselect from 'vue-multiselect'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'video.js/dist/video-js.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'

Vue.directive('closable', closable)
Vue.use(BootstrapVue)
Vue.component('multiselect', Multiselect)

require('es6-promise').polyfill()

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.notForUser)) {
    const {irole} = store.getters.me.profile
    if (irole === 'user') {
      next('/hub/pageNotFound')
    } else {
      store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
      next()
    }
  } else {
    store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
    next()
  }
})
