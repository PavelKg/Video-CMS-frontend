import Vue from 'vue'
import Vuex from 'vuex'
import i18nStore from './i18n'
import Login from './login'
import Users from './users'
import MainWindow from './mainWindow'
import Menu from './menu'
import Videos from './videos'
import Files from './files'
import Comments from './comments'
import Messages from './messages'
import Binding from './binding'
import Companies from './companies'
import History from './history'
import Errors from './errors'
import FieldRestr from './field-restr'
import Settings from './settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    i18nStore,
    Login,
    Users,
    MainWindow,
    Menu,
    Videos,
    Files,
    Comments,
    Messages,
    Binding,
    Companies,
    Errors,
    History,
    FieldRestr,
    Settings
  }
})
