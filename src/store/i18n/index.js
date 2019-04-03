import { locales, defaultLocale } from './locales'

export default {
  state: {
    lang: {
      locales: [],
      active: ''
    }
  },
  actions: {},
  mutations: {
    INIT_LANG: (state) => {
      state.lang.locales = [...locales]
      state.lang.active = defaultLocale
    },
    changeLang: (state) => (code) => {
      state.lang.active = code
    }
  },
  getters: {
    locales: (state) => {
      return state.lang.locales
    }
  }
}
