import Api from '@/api'

export default {
  state: {
    messages: {
      list: [],
      receivers: [],
      isListLoading: false,
      isReceiversLoading: false,
      selected: null
    },
    columns_name: {
      outbox: ['check', 'subject', 'to', 'sent'],
      inbox: ['check', 'subject', 'from', 'received']
    }
  },
  actions: {
    async LOAD_MESSAGES({commit}, payload = {}) {
      const {filter} = payload
      try {
        commit('SET_MESSAGES_IS_LOADING', true)
        const result = await Api.messages(filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_MESSAGES', result.data)
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
      state.messages.list = [...list]
    },
    SET_MESSAGES_IS_LOADING(state, isload) {
      state.messages.isListLoading = isload
    },
    SET_ACTIVE_MESSAGE(state, item) {
      state.messages.selected = item
    },
    SET_MESSAGE_RECEIVERS(state, list) {
      state.messages.receivers = [...list]
    },
    SET_RECEIVERS_IS_LOADING(state, isLoad) {
      state.messages.isReceiversLoading = isLoad
    },
    SET_MESSAGE_STAR(state, payload) {
      const {mid, starred} = payload
      state.messages.list.forEach((element, idx) => {
        if (element.mid === mid) {
          state.messages.list[idx].starred = starred
        }
      })
    }
  },
  getters: {
    messages: state => state.messages.list,
    active_message: state => state.messages.selected,
    message_box_column: state => tab => state.columns_name[tab],
    isShowModalMessageInfo: state => state.messages.isShowModalMessageInfo,
    message_receivers: state => state.messages.receivers
  }
}
