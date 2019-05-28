export default {
  state: {
    isShowModal: false,
    message: ''
  },
  actions: {},
  mutations: {
    SHOW_MESSAGE_ERROR(state, message) {
      state.message = message
      state.isShowModal = true
    },
    HIDE_MESSAGE_ERROR(state) {
      state.message = ''
      state.isShowModal = false
    }
  },
  getters: {
    errors_isShow: state => state.isShowModal,
    errors_message: state => state.message
  }
}