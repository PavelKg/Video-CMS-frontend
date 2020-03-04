export default {
  inserted: function(el, binding, vnode) {
    event = (e) => {
      e.stopPropagation()
      const {handler} = binding.value
      vnode.context[handler]()
      el.removeEventListener('scroll', event)
    }
    el.addEventListener('scroll', event)
  },
  unbind(el) {}
}
