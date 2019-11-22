import Api from '@/api'

export default {
  state: {
    list: [],
    isListLoading: false,
    selected: null
  },
  actions: {
    async LOAD_GROUPS({commit}, payload) {
      const {cid, filter} = payload
      try {
        commit('SET_GROUPS_IS_LOADING', true)
        const result = await Api.groups(cid, filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_GROUPS', result.data)
        } else {
          throw Error('Error load groups list')
        }
      } catch (err) {
        throw Error('Error request groups from server')
      } finally {
      }
    },
    async LOAD_GROUP_INFO({commit}, payload) {
      const {cid, gid} = payload
      try {
        const result = await Api.group_info(cid, gid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load groups list')
        }
      } catch (err) {
        throw Error('Error request groups from server')
      } finally {
      }
    },
    // async LOAD_GROUP_DATA({commit}, payload) {
    //   try {
    //     const result = await Api.group_data(payload)
    //     if (result.data && result.status === 200) {
    //       commit('SET_ACTIVE_GROUP', result.data)
    //     } else {
    //       throw Error('Error load group data')
    //     }
    //   } catch (err) {
    //     console.log('load group-data', err.response)
    //   }
    // },
    async GROUP_ADD({commit, getters}, payload) {
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
    async GROUP_DEL({commit, getters}, gid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.group_del({cid, gid})
        if (result.status === 204) {
          return Promise.resolve('Group updated success')
        } else {
          throw Error(`Error update group, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    },
    async GROUP_SERIES_DEL({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {gid, sid} = payload
      try {
        const result = await Api.group_series_del({cid, gid, sid})
        if (result.status === 204) {
          return Promise.resolve('Group series updated success')
        } else {
          throw Error(`Error update group series, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    }    
  },
  mutations: {
    SET_GROUPS: (state, groups) => {
      state.list = [...groups]
    },
    SET_ACTIVE_GROUP(state, group) {
      state.selected = group
    },
    SET_GROUPS_IS_LOADING(state, isload) {
      state.isListLoading = isload
    }
  },
  getters: {
    groups: (state) => state.list,
    group_selected: (state) => state.selected,
    groups_is_loading: (state) => state.isListLoading
  }
}
