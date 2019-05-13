import Api from '@/api'

export default {
  state: {
    users: {
      list: [],
      isListLoading: false,
      selected: null
    }
  },
  actions: {
    async LOAD_USERS({commit}, payload) {
      const {cid, filter} = payload
      try {
        commit('SET_USERS_IS_LOADING', true)
        const result = await Api.users(cid, filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_USERS', result.data)
        } else {
          throw Error('Error load users list')
        }
      } catch (err) {
        throw Error('Error request users from server')
      } finally {
        commit('SET_USERS_IS_LOADING', false)
      }
    }
  },
  mutations: {
    SET_USERS(state, user_list) {
      state.users.list = [...user_list]
    },
    SET_USERS_IS_LOADING(state, isload) {
      state.users.isListLoading = isload
    },
    SET_ACTIVE_USER(state, user) {
      state.users.selected = user
    },    
  },
  getters: {
    users_list: state => state.users.list,
    users_is_loading: state => state.users.isListLoading,
    user_selected: state => state.users.selected
  }
}
