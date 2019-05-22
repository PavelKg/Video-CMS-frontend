import { locales, defaultLocale } from './locales'
import i18n from '../../i18n';


export default {
  state: {
    lang: {
      locales: [],
      active: localStorage.getItem('vcms-lang') || defaultLocale
    }
  },
  actions: {},
  mutations: {
    INIT_LANG: (state) => {
      state.lang.locales = [...locales]
      i18n.locale = state.lang.active
    },
    CHANGE_LANG: (state, code) => {
      localStorage.setItem('vcms-lang', code)
      state.lang.active = code
      i18n.locale = state.lang.active
    }
  },
  getters: {
    locales: (state) => {
      return state.lang.locales
    }
  }
}
