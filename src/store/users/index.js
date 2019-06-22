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
    },
    async USER_ADD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.user_add(cid, payload)
        if (result.status === 201) {
          return Promise.resolve('User added success')
        } else {
          throw Error(`Error add user, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error add new user: ${err.response.data.message}`)
      }
    },
    async USER_UPD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {uid, fullname, gid, rid, email, password} = payload
      try {
        const result = await Api.user_upd(
          {cid, uid},
          {fullname, gid, rid, email, password}
        )
        if (result.status === 200) {
          return Promise.resolve('User updated success')
        } else {
          throw Error(`Error update user, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error update user: ${err.response.data.message}`)
      }
    },
    async USER_DEL({commit, getters}, uid) {
      const cid = getters.me.profile.company_id
      //const {uid} = getters.user_selected
      try {
        const result = await Api.user_del({cid, uid})
        if (result.status === 204) {
          return Promise.resolve('User deleted success')
        } else {
          throw Error(`Error delete user, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error delete user: ${err}`)
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
    }
  },
  getters: {
    users_list: state => state.users.list,
    users_is_loading: state => state.users.isListLoading,
    user_selected: state => state.users.selected
  }
}
