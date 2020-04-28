import Api from '@/api'
console.log('process=', process.env)
const {NODE_ENV} = process.env

export default {
  state: {
    telegram: {
      botname: null
    }
  },
  actions: {
    async GET_TELEGRAM_OPTIONS({commit}) {
      const botname = NODE_ENV === 'development' ? 'vcmsbot' : 'vcmsbot'
      const options = {botname: botname}
      commit('SET_TELEGRAM_OPTIONS', options)
    },
    async GET_TELEGRAM_AUTH_LINK({state, commit}) {
      const link = `https://t.me/vcmsbot?start=vCH1vGWJxfSeofSAs0K5PA`
      return link
    }
  },
  mutations: {
    SET_TELEGRAM_OPTIONS(state, option) {
      state.telegram = {...state.telegram, ...option}
    }
  },
  getters: {}
}
