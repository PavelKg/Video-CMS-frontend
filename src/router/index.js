import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
import Hub from '../hub/'
import Login from './login'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.hasToken) {

    next()
    //return
  }
  const isAuth = store.getters.authStatus === 'success'
  if (isAuth) {
    next(`/hub/${store.getters.me_irole}`)
  } else {
    store.commit('SET_HEADER_AUTH')
    store
      .dispatch('GET_MY_PROFILE')
      .then(() => {
        next(`/hub/${store.getters.me_irole}`)
      })
      .catch(err => next('/login'))
  }
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.hasToken) {
    store.commit('SET_HEADER_AUTH')
    store
      .dispatch('GET_MY_PROFILE')
      .then(() => {
        console.log('ifAuthenticated - ok')
        next()
      })
      .catch(err => {
        console.log('ifAuthenticated - err')
        next('/login')
      })
  } else {
    next('/login')
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/login'
    },
    {
      path: '/hub/:role',
      name: 'Role',
      component: Hub,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      //beforeEnter: ifNotAuthenticated
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
