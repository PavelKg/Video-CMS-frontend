function checkKey(target = [], children) {
  console.log({target}, {children})

  const nextTarget = [...target]
  const currKey = nextTarget.shift()

  console.log(
    'children.subItems.hasOwnProperty(currKey)=',
    children.subItems.hasOwnProperty(currKey)
  )
  if (!children.subItems.hasOwnProperty(currKey)) {
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
  //console.log({target})
  console.log({userMenu})
  const hasAccess = checkKey(target, userMenu)
  if (!hasAccess) {
    next('/pageNotFound')
  } else {
    next()
  }
}
