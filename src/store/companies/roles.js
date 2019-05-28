import Api from '@/api'

export default {
  state: {
    roles: {
      list: [],
      isListLoading: false,
      selected: null
    }
  },
  actions: {
    async LOAD_ROLES({commit}, _cid) {
      try {
        commit('SET_ROLES_IS_LOADING', true)
        const result = await Api.roles(_cid)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_ROLES', result.data)
        } else {
          throw Error('Error load roles list')
        }
      } catch (err) {
        throw Error('Error request roles from server')
      } finally {
        commit('SET_ROLES_IS_LOADING', false)
      }
    },
    async LOAD_ROLE_DATA({commit}, payload) {
      try {
        const result = await Api.role_data(payload)
        if (result.data && result.status === 200) {
          commit('SET_ACTIVE_ROLE', result.data)
        } else {
          throw Error('Error load role data')
        }
      } catch (err) {
        console.log('load role-data', err.response)
      }
    },
    async ROLE_ADD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.role_add(cid, payload)
        if (result.status === 201) {
          return Promise.resolve('Role added success')
        } else {
          throw Error(`Error add role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error add new role: ${err.response.data.message}`)
      }
    },
    async ROLE_UPD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {rid, name, is_admin} = payload
      try {
        const result = await Api.role_upd({cid, rid}, {name, is_admin})
        if (result.status === 200) {
          return Promise.resolve('Role updated success')
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error update role: ${err.response.data.message}`)
      }
    },
    async ROLE_DEL({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {rid} = getters.role_selected
      try {
        const result = await Api.role_del({cid, rid})
        if (result.status === 204) {
          return Promise.resolve('Role updated success')
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      }
    }
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles.list = [...roles]
    },
    SET_ACTIVE_ROLE(state, role) {
      state.roles.selected = role
    },
    SET_ROLES_IS_LOADING(state, isload) {
      state.roles.isListLoading = isload
    }
  },
  getters: {
    roles: state => state.roles.list,
    role_selected: state => state.roles.selected,
    roles_is_list_loading: state => state.roles.isListLoading
  }
}
