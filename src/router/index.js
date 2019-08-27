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
    store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
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
        {
          path: 'videos',
          component: videos,
          meta: {menuItem: '/hub/videos'}
        },
        {
          path: 'videos_player/uuid/:uuid',
          component: videos_player,
          meta: {menuItem: '/hub/videos'}
        },
        {
          path: 'videos_upload',
          component: videos_upload,
          meta: {menuItem: '/hub/videos', notForUser: 'true'}
        },
        {
          path: 'videos_subtitles/uuid/:uuid',
          component: videos_subtitles,
          meta: {menuItem: '/hub/videos', notForUser: 'true'}
        },
        {
          path: 'users',
          component: users,
          meta: {menuItem: '/hub/users', notForUser: 'true'}
        },
        {
          path: 'users_add',
          component: users_add,
          meta: {menuItem: '/hub/users', notForUser: 'true'},
          props: {oper: 'add'}
        },
        {
          path: 'users_edit/uid/:uid',
          component: users_edit,
          meta: {menuItem: '/hub/users', notForUser: 'true'},
          props: {oper: 'edit'}
        },
        {
          path: 'groups',
          component: groups,
          meta: {menuItem: '/hub/groups', notForUser: 'true'}
        },
        {
          path: 'groups_add',
          component: groups_add,
          meta: {menuItem: '/hub/groups', notForUser: 'true'},
          props: {oper: 'add'}
        },
        {
          path: 'groups_edit/gid/:gid',
          component: groups_edit,
          meta: {menuItem: '/hub/groups', notForUser: 'true'},
          props: {oper: 'edit'}
        },
        {
          path: 'messages',
          component: messages,
          meta: {menuItem: '/hub/messages'}
        },
        {
          path: 'roles',
          component: roles,
          meta: {menuItem: '/hub/roles', notForUser: 'true'}
        },
        {
          path: 'roles_add',
          component: roles_add,
          meta: {menuItem: '/hub/roles', notForUser: 'true'},
          props: {oper: 'add'}
        },
        {
          path: 'roles_edit/rid/:rid',
          component: roles_edit,
          meta: {menuItem: '/hub/roles', notForUser: 'true'},
          props: {oper: 'edit'}
        },
        {
          path: 'screen',
          component: screen,
          meta: {menuItem: '/hub/screen', notForUser: 'true'}
        },
        {path: 'pageNotFound', component: NotFoundComponent}
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
      redirect: '/hub/pageNotFound'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})
