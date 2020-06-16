export default async function auth(to, from, next, store) {
  //console.log('store.getters.hasToken=', store.getters.hasToken)
  if (store.getters.hasToken) {
    try {
      store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
      if (!store.getters.me.profile.hasOwnProperty('uid')) {
        store.commit('SET_HEADER_AUTH')
        await store.dispatch('LOAD_USER_MENU')
        await store.dispatch('GET_MY_PROFILE')
      }
      next()
    } catch (err) {
      console.log('ifAuthenticated - err=', err)
      next('/login')
    }
  } else {
    next('/login')
  }
}
