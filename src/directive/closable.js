const handleOutsideClick = {}

export default {
  bind(el, binding, vnode) {
    handleOutsideClick[el.id] = (e) => {
      e.stopPropagation()
      let {handler, exclude} = binding.value
      let clickedOnExcludedEl = false
      exclude.forEach((itemId) => {
        if (!clickedOnExcludedEl) {
          clickedOnExcludedEl = itemId === e.target.id
        }
      })

      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        vnode.context[handler]()
      }
    }
    document.addEventListener('click', handleOutsideClick[el.id])
    document.addEventListener('touchstart', handleOutsideClick[el.id])
  },
  unbind(el) {
    document.removeEventListener('click', handleOutsideClick[el.id])
    document.removeEventListener('touchstart', handleOutsideClick[el.id])
    delete handleOutsideClick[el.id]
  }
}
