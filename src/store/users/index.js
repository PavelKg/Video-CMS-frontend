import Api from '@/api'

const temp_users= [
  {cid: "admin", name: "admin", group:"number1", last_login: "2019/03/31"},
  {cid: "001", name: "User1", group:"number1", last_login: "2019/03/31"},
  {cid: "002", name: "User2", group:"number1", last_login: "2019/03/31"},
  {cid: "003", name: "User3", group:"number1", last_login: "2019/03/31"},

]

export default {
  state: {
    me: {
      profile: null
    },
    users: [...temp_users]
  },
  actions: {
    async GET_MY_PROFILE({commit, dispatch}) {
      try {
        const result = await Api.my_profile()
        commit('SET_USER', result.data)
        // if (localStorage.getItem('vcms-user')) {
        //   try {
        //     const user = JSON.parse(localStorage.getItem('vcms-user'))
        //     if (user !== {}) {
        //       commit('SET_USER', user)
        //     }
        //   } catch (e) {
        //     localStorage.removeItem('vcms-user')
        //   }
        // }
      } catch (e) {
        dispatch('LOGOUT', null, {root: true})
      }
    }
  },
  mutations: {
    SET_USER: (state, _profile) => {
      state.me.profile = {..._profile}
      //localStorage.setItem('vcms-user', JSON.stringify(state.user))
    },
  },
  getters: {
    me: state => state.me,
    me_irole: state => state.me.profile.irole,
    users_list: state => state.users
  }
}
