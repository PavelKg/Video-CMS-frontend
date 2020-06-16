function checkKey(target = [], children) {
  const nextTarget = [...target]
  const currKey = nextTarget.shift()

  if (!children.subItems || !children.subItems.hasOwnProperty(currKey)) {
    return false
  }

  if (nextTarget.length > 0) {
    return checkKey(nextTarget, children.subItems[currKey])
  } else {
    return true
  }
}

export default function access(to, from, next, store) {
  const {userMenu} = store.getters
  const target = to.meta.target.split('/')
  const hasAccess = checkKey(target, userMenu)
  if (!hasAccess) {
    next('/pageNotFound')
  } else {
    next()
  }
}
