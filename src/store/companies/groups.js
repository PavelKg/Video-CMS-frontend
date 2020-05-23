import Api from '@/api'

export default {
  state: {
    list: [],
    isListLoading: false,
    selected: null
  },
  actions: {
    async LOAD_GROUPS({commit}, payload) {
      const {cid, filter = ''} = payload
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
    async LOAD_GROUP_PARENTS({commit}, payload) {
      const {cid, gid = null} = payload
      const filter = gid ? `group_gid[noteq]:${gid}` : null
      try {
        const result = await Api.group_parents(cid, filter)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw 'Error load group parents'
        }
      } catch (err) {
        throw ('Error load group parents', err.response)
      }
    },
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
        throw err.response.data
      }
    },
    async GROUP_UPD({getters}, payload) {
      const cid = getters.me.profile.company_id
      const {gid, name, parent, group_series} = payload
      try {
        const result = await Api.group_upd(
          {cid, gid},
          {name, parent, group_series}
        )
        if (result.status === 200) {
          return Promise.resolve('Group updated success')
        } else {
          throw Error(`Error update group, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async GROUP_DEL({getters}, gid) {
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
    async GROUP_SERIES_MULTI_OPER({dispatch}, payload) {
      const {gid_list = [], sid, oper} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      await Promise.all(
        gid_list.map(async (gid) => {
          await dispatch(`GROUP_SERIES_OPER`, {gid, sid, oper: lOper})
        })
      )
      return Promise.resolve('Group series operation finished')
    },

    async GROUP_SERIES_OPER({getters}, payload) {
      const cid = getters.me.profile.company_id
      const {gid, sid, oper} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      try {
        const result = await Api[`group_series_${lOper}`]({cid, gid, sid})

        if (result.status === 204) {
          return Promise.resolve('Group series updated success')
        } else {
          throw Error(`Error update group series, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    },
    async GROUP_BIND_SERIES({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {sid} = payload
      try {
        const result = await Api.group_bind_series({cid, sid})
        if (result.status === 200) {
          return result.data
        } else {
          throw Error(
            `Error get group list binding series, status - ${result.status}`
          )
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
