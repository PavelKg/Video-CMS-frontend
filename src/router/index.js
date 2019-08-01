import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
import Hub from '../hub/'
import Login from './login'
import RecoveryPassword from './recovery_password'

const videos = () => import('@/hub/templates/video-catalog')
const messages = () => import('@/hub/templates/messages')
const users = () => import('@/hub/templates/users')
const users_add = () => import('@/hub/templates/users/mng')
const users_edit = () => import('@/hub/templates/users/mng')
const groups = () => import('@/hub/templates/groups')
const groups_add = () => import('@/hub/templates/groups/mng')
const groups_edit = () => import('@/hub/templates/groups/mng')
const roles = () => import('@/hub/templates/roles/')
const roles_add = () => import('@/hub/templates/roles/mng')
const roles_edit = () => import('@/hub/templates/roles/mng')
const screen = () => import('@/hub/templates/screen')
const videos_player = () => import('@/hub/templates/video-player')
const videos_upload = () => import('@/hub/templates/video-upload')
const videos_subtitles = () => import('@/hub/templates/video-subtitles')

Vue.use(Router)

const ifNotTokenRecovery = (to, from, next) => {
  const {token} = to.query
  console.log('token=', token)
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
    next(`/hub`)
  } else {
    store.commit('SET_HEADER_AUTH')
    store
      .dispatch('GET_MY_PROFILE')
      .then(() => {
        next(`/hub`)
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
  //base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/login'
    },
    {
      path: '/hub',
      name: 'hub',
      component: Hub,
      beforeEnter: ifAuthenticated,
      children: [
        {path: 'videos', component: videos},
        {path: 'videos_player', component: videos_player},
        {path: 'videos_upload', component: videos_upload},
        {path: 'videos_subtitles', component: videos_subtitles},
        {path: 'users', component: users},
        {path: 'users_add', component: users_add},
        {path: 'users_edit', component: users_edit},                
        {path: 'groups', component: groups},
        {path: 'groups_add', component: groups_add},
        {path: 'groups_edit', component: groups_edit},
        {path: 'messages', component: messages},
        {path: 'roles', component: roles},
        {path: 'roles_add', component: roles_add},
        {path: 'roles_edit', component: roles_edit}, 
        {path: 'screen', component: screen}
      ]
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
