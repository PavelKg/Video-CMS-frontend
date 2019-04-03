export default {
  state: {
    mainWindowRect: {
      width: 0,
      height: 0,
      tabletMaxWidth: 768,
      mobileMaxWidth: 450
    }
  },
  actions: {},
  mutations: {
    windowsResize(state, rect) {
      state.mainWindowRect.width = rect.width
      state.mainWindowRect.height = rect.height
    }
  },
  getters: {
    windowsRect(state) {
      return state.mainWindowRect
    }
  }
}
