import Vue from 'vue'
import Vuex from 'vuex'
import i18nStore from './i18n'
import Login from './login'
import User from './user'
import MainWindow from './mainWindow'
import Menu from './menu'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {i18nStore, Login, User, MainWindow, Menu}
})

