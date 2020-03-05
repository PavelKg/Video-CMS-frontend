;(function() {
  if (typeof window.CustomEvent === 'function') return false

  function CustomEvent(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: null}
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  window.CustomEvent = CustomEvent
})()
;(function() {
  var throttle = function(type, name, obj) {
    obj = obj || window
    var running = false
    var func = function() {
      if (running) {
        return
      }
      running = true
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name))
        running = false
      })
    }
    obj.addEventListener(type, func)
  }

  /* init - you can init any event */
  throttle('resize', 'optimizedResize')
})()

const handleWinResize = {}
export default {
  inserted: function(el, binding, vnode) {
    const childTable = el.children[0]
    let event = (e) => {
      e.stopPropagation()
      const {scrollHandler} = binding.value
      vnode.context[scrollHandler]()

      el.removeEventListener('scroll', event)
    }

    handleWinResize[childTable.id] = (e) => {
      const {isScrollable} = binding.value
      vnode.context[isScrollable] =
        childTable.scrollWidth > el.offsetWidth ? true : false
    }

    window.addEventListener('optimizedResize', handleWinResize[childTable.id])
    el.addEventListener('scroll', event)
  },

  unbind(el) {
    const childTable = el.children[0]
    el.removeEventListener('scroll', event)
    window.removeEventListener(
      'optimizedResize',
      handleWinResize[childTable.id]
    )
  }
}
