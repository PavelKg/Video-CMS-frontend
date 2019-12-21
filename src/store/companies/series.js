import Api from '@/api'

export default {
  state: {
    list: [],
    isListLoading: false,
    selected: null
  },
  actions: {
    async LOAD_SERIES({commit}, payload) {
      const {cid, filter = ''} = payload

      try {
        commit('SET_SERIES_IS_LOADING', true)
        const result = await Api.series(cid, filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_SERIES', result.data)
        } else {
          throw Error('Error load series list')
        }
      } catch (err) {
        throw Error('Error request series from server')
      } finally {
      }
    },
    async LOAD_SERIES_INFO({commit}, payload) {
      const {cid, sid} = payload
      try {
        const result = await Api.series_info(cid, sid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load series list')
        }
      } catch (err) {
        throw Error('Error request series from server')
      } finally {
      }
    },
    // async LOAD_SERIES_DATA({commit}, payload) {
    //   try {
    //     const result = await Api.series_data(payload)
    //     if (result.data && result.status === 200) {
    //       commit('SET_ACTIVE_SERIES', result.data)
    //     } else {
    //       throw Error('Error load series data')
    //     }
    //   } catch (err) {
    //     console.log('load series-data', err.response)
    //   }
    // },
    async SERIES_ADD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.series_add(cid, payload)
        if (result.status === 201) {
          return Promise.resolve('Series added success')
        } else {
          throw Error(`Error add series, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error add new series: ${err.response.data.message}`)
      }
    },
    async SERIES_UPD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {
        sid,
        name,
        period_type,
        activity_start,
        activity_finish,
        is_private,
        description,
        tags
      } = payload

      try {
        const result = await Api.series_upd(
          {cid, sid},
          {
            name,
            period_type,
            activity_start,
            activity_finish,
            is_private,
            description,
            tags
          }
        )
        if (result.status === 204) {
          return Promise.resolve('Series updated success')
        } else {
          throw Error(`Error update series, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error update series: ${err.response.data.message}`)
      }
    },
    async SERIES_DEL({commit, getters}, sid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.series_del({cid, sid})
        if (result.status === 204) {
          return Promise.resolve('Series deleted success')
        } else {
          throw Error(`Error update series, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    }
  },
  mutations: {
    SET_SERIES: (state, series) => {
      state.list = [...series]
    },
    SET_ACTIVE_SERIES(state, series) {
      state.selected = series
    },
    SET_SERIES_IS_LOADING(state, isload) {
      state.isListLoading = isload
    }
  },
  getters: {
    // series: (state) => state.seriess.list,
    // series_selected: (state) => state.selected,
    // series_is_loading: (state) => state.isListLoading
  }
}
