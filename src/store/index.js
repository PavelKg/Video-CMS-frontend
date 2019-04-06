import Vue from 'vue'
import Vuex from 'vuex'
import i18nStore from './i18n'
import Login from './login'
import User from './user'
import MainWindow from './mainWindow'
import Menu from './menu'
import Videos from './videos'
import Comments from './comments'
import Messages from './messages'
import Companies from './companies'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {i18nStore, Login, User, MainWindow, Menu, Videos, Comments, Messages, Companies}
})

