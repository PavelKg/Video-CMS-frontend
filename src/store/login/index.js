import Api from '@/api'

export default {
  state: {
    token: localStorage.getItem('vcms-token') || '',
    authStatus: '',
    isHeaderAuth: false,
    roles: ['super', 'admin', 'user'],
    me: {
      profile: {}
    }
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
      }
    },
    async LOGOUT({commit, dispatch}) {
      localStorage.removeItem('vcms-token')
      await Api.delHeaderAuth()
      commit('AUTH_LOGOUT')
      Api.logout()
    },

    async GET_MY_PROFILE({commit, dispatch, state}) {
      try {
        console.log('GET_MY_PROFILE')
        const result = await Api.my_profile()
        commit('SET_USER', result.data)
      } catch (e) {
        dispatch('LOGOUT')
        throw Error('Getting profile error')
      }
    },

    async GET_MY_COMPANY_INFO({commit}) {
      try {
        const result = await Api.my_company_info()
        return result.data
      } catch (e) {
        throw Error('Getting my company info error')
      }
    },
    async PASSWORD_RECOVERY({commit}, payload) {
      const {email, locale} = payload
      try {
        const resp = await Api.password_reset_request({email, locale})
        const code = resp.status
        if (code !== 202) {
          throw Error('Email is not find')
        }
      } catch (error) {}
    },
    async SAVE_RECOVERY_PASSWORD({commit}, payload) {
      const {token, password} = payload
      try {
        const resp = await Api.save_req_pass(token, password)
        const code = resp.status
        if (code !== 200) {
          console.log(result)
        }
      } catch (error) {}
    }
  },
  mutations: {
    AUTH_REQUEST: (state) => {
      state.authStatus = 'loading'
    },
    AUTH_SUCCESS: (state, token) => {
      state.token = token
      state.authStatus = 'success'
    },
    AUTH_ERROR: (state) => {
      state.authStatus = 'error'
    },
    AUTH_LOGOUT: (state) => {
      console.log('AUTH_LOGOUT')
      state.authStatus = ''
      state.token = ''
      state.me.profile = {}
      state.isHeaderAuth = false
    },
    SET_HEADER_AUTH: (state) => {
      if (!state.isHeaderAuth) {
        Api.setHeaderAuth(state.token)
        state.isHeaderAuth = true
      }
    },
    SET_USER: (state, _profile) => {
      state.me.profile = {..._profile}
    }
  },
  getters: {
    token: (state) => state.token,
    hasToken: (state) => Boolean(state.token),
    authStatus: (state) => state.authStatus,
    me: (state) => state.me,
    me_irole: (state) => state.me.profile.irole
  }
}
