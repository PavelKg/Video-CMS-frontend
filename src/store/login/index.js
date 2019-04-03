//import Api from '@/api'

export default {
  state: {
    token: localStorage.getItem('vcms-token') || '',
    authStatus: '',
  },
  actions: {
    async LOGIN({commit}, formData) {
      commit('AUTH_REQUEST')
      const {personalId, password} = formData

      try {
        //const resp = await Api.login({personalId, companyId, password})
        const resp = {data: {code:200, token: 238478242342346782346578634785678346576347856378246578023}}

        const {code, token} = resp.data
        if (code === 200) {
          localStorage.setItem('vcms-token', token)
          commit('AUTH_SUCCESS', token)
          const roles = ['super', 'admin', 'user']
          const user_details = {id:personalId, company_id:1, role_name:personalId}
          if (roles.indexOf(personalId) === -1) {
            user_details.role_name='user'
          }
          commit('SET_USER', user_details)
          //commit('SET_HEADER_AUTH')
        } else {
          throw Error('Authorization error')
        }
      } catch (err) {
        commit('AUTH_ERROR', err)
        localStorage.removeItem('vcms-token') // if the request fails, remove any possible user token if possible
      }
    },
    async LOGOUT({commit}) {
      localStorage.removeItem('vcms-token')
      localStorage.removeItem('vcms-menu')
      //Api.delHeaderAuth()
      commit('AUTH_LOGOUT', null)
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
      //Api.setHeaderAuth(state.token)
    }
  },
  getters: {
    token: state => state.token,
    isAuthenticated: state => Boolean(state.token),
    authStatus: state => state.authStatus
  }
}
