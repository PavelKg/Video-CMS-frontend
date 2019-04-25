let handleOutsideClick

export default {
  bind(el, binding, vnode) {
    handleOutsideClick = e => {
      e.stopPropagation()
      const {handler, exclude} = binding.value
      let clickedOnExcludedEl = false
      exclude.forEach(itemId => {
        if (!clickedOnExcludedEl) {
          clickedOnExcludedEl = itemId === e.target.id
        }
      })

      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        vnode.context[handler]()
      }
    }
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
  },
  unbind() {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('touchstart', handleOutsideClick)
  }
}
