import Vue from 'vue'
import Vuex from 'vuex'
import i18nStore from './i18n'
import Login from './login'
import Users from './users'
import MainWindow from './mainWindow'
import Menu from './menu'
import Videos from './videos'
import Comments from './comments'
import Messages from './messages'
import Binding from './binding'
import Companies from './companies'
import History from './history'
import Errors from './errors'
import FieldRestr from './field-restr'

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
    Comments,
    Messages,
    Binding,
    Companies,
    Errors,
    History,
    FieldRestr
  }
})
