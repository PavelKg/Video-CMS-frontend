import Api from '@/api'

export default {
  state: {
    history: {
      list: [],
      isListLoading: false,
      isCategoriesLoading: false,
      isObjectsLoading: false,
      selected: null
    }
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
          throw Error('Error load categories list')
        }
      } catch (err) {
        throw Error('Error request categories from server')
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
          throw Error('Error load category objects list')
        }
      } catch (err) {
        throw Error('Error request category objects from server')
      } finally {
      }
    }    
  },
  mutations: {
    SET_CATEGORIES_IS_LOADING(state) {
      state.history.isCategoriesLoading = state
    }
  },
  getters: {}
}
