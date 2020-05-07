import Api from '@/api'
console.log('process=', process.env)
const {NODE_ENV} = process.env
const bots = {dev: 'vcmsTestBot', prod: 'vcmsbot'}

export default {
  state: {
    telegram: {
      botname: null
    }
  },
  actions: {
    async GET_TELEGRAM_OPTIONS({commit}) {
      const botname = NODE_ENV === 'local' ? bots['dev'] : bots['prod']
      const options = {botname: botname}
      commit('SET_TELEGRAM_OPTIONS', options)
    },
    async GET_TELEGRAM_AUTH_LINK({state, getters}) {
      const cid = getters.me.profile.company_id
      const botname = state.telegram.botname
      try {
        const result = await Api.telegram_url_deeplink(cid, botname)
        if (result.status === 200 && result.data.url) {
          return result.data.url
        } else {
          throw 'Error auth login telegram'
        }
      } catch (err) {
        throw err.response ? err.response.data.message : err
      } finally {
      }
    },
    async TELEGRAM_AUTH_LOGIN({getters}, user) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.telegram_auth_login(cid, user)
        if (result.status === 201) {
          console.log('confirmed')
        } else {
          throw 'Error auth login telegram'
        }
      } catch (err) {
        throw 'Error auth login telegram:' + err
      } finally {
        //commit('SET_USERS_IS_LOADING', false)
      }
    }
  },
  mutations: {
    SET_TELEGRAM_OPTIONS(state, option) {
      state.telegram = {...state.telegram, ...option}
    }
  },
  getters: {}
}
