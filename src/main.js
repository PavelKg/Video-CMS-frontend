//import '@babel/polyfill'
//import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import i18n from './i18n'

//Directivies
//import dirClickOutside from './directive/click-outside.js'
import closable from './directive/closable.js'
import scrollHint from './directive/scroll-hint.js'

import BootstrapVue from 'bootstrap-vue'
import {BootstrapVueIcons} from 'bootstrap-vue'

import Vuelidate from 'vuelidate'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
//import 'bootstrap-vue/dist/icons.scss'
import 'video.js/dist/video-js.css'

Vue.directive('closable', closable)
Vue.directive('scrollHint', scrollHint)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuelidate)

require('es6-promise').polyfill()

Vue.config.productionTip = false

Vue.config.errorHandler = function(err, vm, info) {
  // Обработка ошибки. В `info` подробности Vue-специфичной ошибки,
  // например, в каком хуке жизненного цикла произошла ошибка.
  // Доступно только в версиях 2.2.0+
  console.log('ErrorHandler: ', err, vm, info)
}

if (!Date.prototype.toLocalDateString) {
  ;(function() {
    function pad(number) {
      if (number < 10) {
        return '0' + number
      }
      return number
    }

    Date.prototype.toLocalDateString = function() {
      return (
        this.getFullYear() +
        '-' +
        pad(this.getMonth() + 1) +
        '-' +
        pad(this.getDate()) +
        ' ' +
        pad(this.getHours()) +
        ':' +
        pad(this.getMinutes()) +
        ':' +
        pad(this.getSeconds()) +
        '.' +
        (this.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
      )
    }
  })()
}

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
