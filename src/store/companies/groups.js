import Api from '@/api'

export default {
  state: {
    groups: {
      list: [],
      isListLoading: false,
      selected: null
    }
  },
  actions: {
    async LOAD_GROUPS({commit}, _cid) {
      try {
        commit('SET_GROUPS_IS_LOADING', true)
        const result = await Api.groups(_cid)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_GROUPS', result.data)
        } else {
          throw Error('Error load groups list')
        }
      } catch (err) {
        throw Error('Error request groups from server')
      } finally {
        commit('SET_GROUPS_IS_LOADING', false)
      }
    },
    async LOAD_GROUP_DATA({commit}, payload) {
      try {
        const result = await Api.group_data(payload)
        if (result.data && result.status === 200) {
          commit('SET_ACTIVE_GROUP', result.data)
        } else {
          throw Error('Error load group data')
        }
      } catch (err) {
        console.log('load group-data', err.response)
      }
    },
    async GROUP_ADD({commit, getters}, payload) {
      console.log('getters.me.profile=', getters.me.profile)
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.group_add(cid, payload)
        if (result.status === 201) {
          return Promise.resolve('Group added success')
        } else {
          throw Error(`Error add group, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error add new group: ${err.response.data.message}`)
      }
    },
    async GROUP_UPD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {gid, name} = payload
      try {
        const result = await Api.group_upd({cid, gid}, {name})
        if (result.status === 200) {
          return Promise.resolve('Group updated success')
        } else {
          throw Error(`Error update group, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error update group: ${err.response.data.message}`)
      }
    },
    async GROUP_DEL({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {gid} = getters.group_selected
      try {
        const result = await Api.group_del({cid, gid})
        if (result.status === 204) {
          return Promise.resolve('Group updated success')
        } else {
          throw Error(`Error update group, status - ${result.status}`)
        }
      } catch (err) {
        //console.log('err-ror',err.response)
        throw Error(err.response.data.message)
      }
    }
  },
  mutations: {
    SET_GROUPS: (state, groups) => {
      state.groups.list = [...groups]
    },
    SET_ACTIVE_GROUP(state, group) {
      state.groups.selected = group
    },
    SET_GROUPS_IS_LOADING(state, isload) {
      state.groups.isListLoading = isload
    }
  },
  getters: {
    groups: state => state.groups.list,
    group_selected: state => state.groups.selected,
    groups_is_list_loading: state => state.groups.isListLoading
  }
}
