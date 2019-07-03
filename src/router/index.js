import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
import Hub from '../hub/'
import Login from './login'
import RecoveryPassword from './recovery_password'

Vue.use(Router)

const ifNotTokenRecovery = (to, from, next) => {
  const {token} = to.query
  if (token) {
    next()
  } else {
    next('/login')
  }
}

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
      .catch((err) => next('/login'))
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
      .catch((err) => {
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
      path: '/recovery-password',
      name: 'recovery-password',
      component: RecoveryPassword,
      beforeEnter: ifNotTokenRecovery
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
      //beforeEnter: ifNotAuthenticated
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
