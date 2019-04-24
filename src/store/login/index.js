import Api from '@/api'

export default {
  state: {
    token: localStorage.getItem('vcms-token') || '',
    authStatus: '',
    roles: ['super', 'admin', 'user']
  },
  actions: {
    async LOGIN({commit}, formData) {
      commit('AUTH_REQUEST')
      const {personalId, password} = formData

      try {
        const resp = await Api.login({personalId, password})
        const code = resp.status
        const {token} = resp.data
        if (code === 200 && token) {
          localStorage.setItem('vcms-token', token)
          commit('AUTH_SUCCESS', token)
          commit('SET_HEADER_AUTH')
        } else {
          throw Error('Authorization error')
        }
      } catch (err) {
        commit('AUTH_ERROR', err)
        localStorage.removeItem('vcms-token') // if the request fails, remove any possible user token if possible
        localStorage.removeItem('vcms-user')
      }
    },
    async LOGOUT({commit, dispatch}) {
      localStorage.removeItem('vcms-token')
      localStorage.removeItem('vcms-user')
      Api.delHeaderAuth()
      dispatch('CLEAR_MENU_STATE')
      commit('AUTH_LOGOUT')
    }
  },
  mutations: {
    AUTH_REQUEST: state => {
      state.authStatus = 'loading'
    },
    AUTH_SUCCESS: (state, token) => {
      state.token = token
      console.log(token)
      state.authStatus = 'success'
    },
    AUTH_ERROR: state => {
      state.authStatus = 'error'
    },
    AUTH_LOGOUT: state => {
      console.log('AUTH_LOGOUT')
      state.authStatus = ''
      state.token = ''
    },
    SET_HEADER_AUTH: state => {
      Api.setHeaderAuth(state.token)
    }
  },
  getters: {
    token: state => state.token,
    hasToken: state => Boolean(state.token),
    authStatus: state => state.authStatus
  }
}
