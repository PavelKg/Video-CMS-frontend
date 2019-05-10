import Api from '@/api'

export default {
  state: {
    token: localStorage.getItem('vcms-token') || '',
    authStatus: '',
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
        localStorage.removeItem('vcms-user')
      }
    },
    async LOGOUT({commit, dispatch}) {
      localStorage.removeItem('vcms-token')
      localStorage.removeItem('vcms-user')
      Api.delHeaderAuth()
      dispatch('CLEAR_MENU_STATE')
      commit('AUTH_LOGOUT')
    },
    async GET_MY_PROFILE({commit, dispatch}) {
      try {
        const result = await Api.my_profile()
        const {irole = 'user'} = result.data
        commit('SET_USER', result.data)
        dispatch('LOAD_USER_MENU', irole)
      } catch (e) {
        dispatch('LOGOUT')
        throw Error('Getting profile error')
      }
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
    },
    SET_USER: (state, _profile) => {
      state.me.profile = {..._profile}
      //localStorage.setItem('vcms-user', JSON.stringify(state.user))
    }    
  },
  getters: {
    token: state => state.token,
    hasToken: state => Boolean(state.token),
    authStatus: state => state.authStatus,
    me: state => state.me,
    me_irole: state => state.me.profile.irole,
  }
}
