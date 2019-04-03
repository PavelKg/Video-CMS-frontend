// import Api from '@/api'

export default {
  state: {
    user: ''
  },
  actions: {
    async GET_USER_INFO({ commit, dispatch,  }) {
      try {
        //const result = await Api.user_info()
        //commit('SET_USER', result.data.user_info)
      } catch (e) {
        dispatch('LOGOUT', null, { root: true })
      }
    }
  },
  mutations: {
    SET_USER: (state, info) => {
      state.user = {...info}
    }
  },
  getters: {
    user: state => state.user,
    user_role: state => state.user.role_name
  }
}
