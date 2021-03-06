import Api from '@/api'

export default {
  state: {
    list: [],
    receivers: [],
    isListLoading: false,
    isReceiversLoading: false,
    selected: null,

    columns_name: {
      outbox: ['check', 'subject', 'to', 'sent'],
      inbox: ['check', 'subject', 'from', 'received']
    }
  },
  actions: {
    async LOAD_MESSAGES({commit}, payload) {
      const {direction, filter} = payload
      try {
        commit('SET_MESSAGES_IS_LOADING', true)
        const result = await Api.messages(direction, filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_MESSAGES', result.data)
          commit('ORDER_MESSAGE', {sortBy: 'created_at', sortDesc: true})
        } else {
          throw Error('Error load messages list')
        }
      } catch (err) {
        throw Error(`Error request messages from server: ${err}`)
      } finally {
        commit('SET_MESSAGES_IS_LOADING', false)
      }
    },
    async ADD_MESSAGE_STAR({commit}, mid) {
      try {
        const result = await Api.message_starred(mid)
        if (result.status === 201) {
          commit('SET_MESSAGE_STAR', {mid: mid, starred: true})
        } else {
          throw Error('Error starred message')
        }
      } catch (err) {}
    },
    async DEL_MESSAGE_STAR({commit}, mid) {
      try {
        const result = await Api.message_unstarred(mid)
        if (result.status === 204) {
          commit('SET_MESSAGE_STAR', {mid: mid, starred: false})
        } else {
          throw Error('Error unstarred message')
        }
      } catch (err) {}
    },
    async MESSAGE_ADD({commit, getters}, payload) {
      try {
        const result = await Api.message_add(payload)
        if (result.status === 201) {
          return Promise.resolve('Message added success')
        } else {
          throw Error(`Error add message, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error add new message: ${err.response.data.message}`)
      }
    },
    async MESSAGE_DEL({commit, getters}, payload) {
      try {
        const result = await Api.message_del(payload)
        if (result.status === 204) {
          return Promise.resolve('Message deleted success')
        } else {
          throw Error(`Error del message, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error del message: ${err.response.data.message}`)
      }
    },
    async LOAD_MESSAGES_RECEIVERS({commit}, payload = {}) {
      const {filter} = payload
      try {
        commit('SET_RECEIVERS_IS_LOADING', true)
        const result = await Api.receivers(filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_MESSAGE_RECEIVERS', result.data)
        } else {
          throw Error('Error load messages receivers list')
        }
      } catch (err) {
        throw Error(`Error request messages receivers from server: ${err}`)
      } finally {
        commit('SET_RECEIVERS_IS_LOADING', false)
      }
    }
  },
  mutations: {
    SET_MESSAGES(state, list) {
      state.list = [...list]
    },
    SET_MESSAGES_IS_LOADING(state, isload) {
      state.isListLoading = isload
    },
    SET_ACTIVE_MESSAGE(state, item) {
      state.selected = item
    },
    SET_MESSAGE_RECEIVERS(state, list) {
      state.receivers = [...list]
    },
    SET_RECEIVERS_IS_LOADING(state, isLoad) {
      state.isReceiversLoading = isLoad
    },
    SET_MESSAGE_STAR(state, payload) {
      const {mid, starred} = payload
      state.list.forEach((element, idx) => {
        if (element.mid === mid) {
          state.list[idx].starred = starred
        }
      })
    },
    ORDER_MESSAGE(state, payload) {
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
  },
  getters: {
    messages: (state) => state.list,
    active_message: (state) => state.selected,
    messages_box_column: (state) => (tab) => state.columns_name[tab],
    isShowModalMessageInfo: (state) => state.isShowModalMessageInfo,
    message_receivers: (state) => state.receivers
  }
}
