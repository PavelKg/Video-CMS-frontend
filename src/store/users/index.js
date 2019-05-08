import Api from '@/api'

export default {
  state: {
    me: {
      profile: {}
    },
    users: []
  },
  actions: {
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
    SET_USER: (state, _profile) => {
      state.me.profile = {..._profile}
      //localStorage.setItem('vcms-user', JSON.stringify(state.user))
    }
  },
  getters: {
    me: state => state.me,
    me_irole: state => state.me.profile.irole,
    users_list: state => state.users
  }
}
