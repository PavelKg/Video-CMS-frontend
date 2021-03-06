import Api from '@/api'

export default {
  state: {
    list: [],
    isHistoryListLoading: false,
    isCategoriesLoading: false,
    isObjectsLoading: false,
    selected: null
  },
  actions: {
    async LOAD_HISTORY_CATEGORIES({commit}, payload) {
      const {filter = ''} = payload
      commit('SET_CATEGORIES_IS_LOADING', true)
      try {
        const result = await Api.historyCategories({filter})
        if (Array.isArray(result.data) && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load history categories list')
        }
      } catch (err) {
        throw Error('Error request history categories from server')
      } finally {
      }
    },
    async LOAD_HISTORY_OBJECTS({commit}, payload) {
      const {filter = '', categories = ''} = payload
      try {
        const result = await Api.historyCategoryObject({filter, categories})
        if (Array.isArray(result.data) && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load history category objects list')
        }
      } catch (err) {
        throw Error('Error request history category objects from server')
      } finally {
      }
    },
    async LOAD_HISTORY_LIST({commit}, payload) {
      const {constraints} = payload
      const {date_from, date_to, categories, objects, users} = constraints
      const filter = `userhist_user_uid[in]:(${users}),userhist_category[in]:(${categories}),userhist_object_name[in]:(${objects}),users_history_log.created_at[between]:'${date_from}' and '${date_to}'`
      commit('SET_HISTORY_IS_LOADING', true)

      try {
        const result = await Api.history_list({filter})
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_HISTORY_LIST_DATA', result.data)
        } else {
          commit('CLEAR_HISTORY_LIST_DATA')
          throw Error('Error load history category objects list')
        }
      } catch (error) {
        throw Error(`Error load history list from server / ${error}`)
      } finally {
        commit('SET_HISTORY_IS_LOADING', false)
      }
    }
  },
  mutations: {
    SET_CATEGORIES_IS_LOADING(state) {
      state.isCategoriesLoading = state
    },
    SET_HISTORY_IS_LOADING(state, value) {
      state.isHistoryListLoading = value
    },
    SET_HISTORY_LIST_DATA(state, data) {
      state.list = [...data]
    },
    CLEAR_HISTORY_LIST_DATA(state) {
      state.list = []
    },
    ORDER_HISTORY(state, payload) {
      const {sortBy, sortDesc} = payload
      state.list.sort(function(a, b) {
        if (a[sortBy] > b[sortBy]) {
          return sortDesc ? -1 : 1
        }
        if (a[sortBy] < b[sortBy]) {
          return sortDesc ? 1 : -1
        }
        // a eq b
        return 0
      })
    }
  }
}
