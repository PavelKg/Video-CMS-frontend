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
const videos_player = () => import('@/hub/templates/video-player_old')
const videos_upload = () => import('@/hub/templates/video-upload')
const videos_subtitles = () => import('@/hub/templates/video-subtitles')

const NotFoundComponent = () => import('@/hub/templates/NotFoundComponent')

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
        {path: 'videos', component: videos, meta: {menuItem: '/hub/videos'}},
        {
          path: 'videos_player/uuid/:uuid',
          component: videos_player,
          meta: {menuItem: '/hub/videos'}
        },
        {
          path: 'videos_upload',
          component: videos_upload,
          meta: {menuItem: '/hub/videos'}
        },
        {
          path: 'videos_subtitles/vid/:vid',
          component: videos_subtitles,
          meta: {menuItem: '/hub/videos'}
        },
        {path: 'users', component: users, meta: {menuItem: '/hub/users'}},
        {
          path: 'users_add',
          component: users_add,
          meta: {menuItem: '/hub/users'},
          props: {oper: 'add'}
        },
        {
          path: 'users_edit/uid/:uid',
          component: users_edit,
          meta: {menuItem: '/hub/users'},
          props: {oper: 'edit'}
        },
        {path: 'groups', component: groups, meta: {menuItem: '/hub/groups'}},
        {
          path: 'groups_add',
          component: groups_add,
          meta: {menuItem: '/hub/groups'},
          props: {oper: 'add'}
        },
        {
          path: 'groups_edit/gid/:gid',
          component: groups_edit,
          meta: {menuItem: '/hub/groups'},
          props: {oper: 'edit'}
        },
        {
          path: 'messages',
          component: messages,
          meta: {menuItem: '/hub/messages'}
        },
        {path: 'roles', component: roles, meta: {menuItem: '/hub/roles'}},
        {
          path: 'roles_add',
          component: roles_add,
          meta: {menuItem: '/hub/roles'},
          props: {oper: 'add'}
        },
        {
          path: 'roles_edit/rid/:rid',
          component: roles_edit,
          meta: {menuItem: '/hub/roles'},
          props: {oper: 'edit'}
        },
        {path: 'screen', component: screen, meta: {menuItem: '/hub/screen'}},
        {path: 'pageNotFind', component: NotFoundComponent}
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
      //component: NotFoundComponent
      redirect: '/hub/pageNotFind'
    }
  ]
})
