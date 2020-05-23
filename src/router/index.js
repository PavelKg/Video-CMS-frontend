import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
import Hub from '../hub/'
import Login from './login'
import RecoveryPassword from './recovery_password'

const videos = () =>
  import(/* webpackChunkName: "group-video" */ '@/hub/templates/video-catalog')
const messages = () =>
  import(/* webpackChunkName: "group-messages" */ '@/hub/templates/messages')
const users = () =>
  import(/* webpackChunkName: "group-user" */ '@/hub/templates/users')
const users_add = () =>
  import(/* webpackChunkName: "group-user" */ '@/hub/templates/users/mng')
const users_edit = () =>
  import(/* webpackChunkName: "group-user" */ '@/hub/templates/users/mng')
const groups = () =>
  import(/* webpackChunkName: "group-groups" */ '@/hub/templates/groups')
const groups_add = () =>
  import(/* webpackChunkName: "group-groups" */ '@/hub/templates/groups/mng')
const groups_edit = () =>
  import(/* webpackChunkName: "group-groups" */ '@/hub/templates/groups/mng')
const series = () =>
  import(/* webpackChunkName: "group-series" */ '@/hub/templates/series')
const series_add = () =>
  import(/* webpackChunkName: "group-series" */ '@/hub/templates/series/mng')
const series_edit = () =>
  import(/* webpackChunkName: "group-series" */ '@/hub/templates/series/mng')
const binding = () =>
  import(/* webpackChunkName: "group-binding" */ '@/hub/templates/binding')
const roles = () =>
  import(/* webpackChunkName: "group-roles" */ '@/hub/templates/roles/')
const roles_add = () =>
  import(/* webpackChunkName: "group-roles" */ '@/hub/templates/roles/mng')
const roles_edit = () =>
  import(/* webpackChunkName: "group-roles" */ '@/hub/templates/roles/mng')
const screen = () =>
  import(/* webpackChunkName: "group-screen" */ '@/hub/templates/screen')
const videos_player = () =>
  import(/* webpackChunkName: "group-video" */ '@/hub/templates/video-player')
const videos_upload = () =>
  import(/* webpackChunkName: "group-video" */ '@/hub/templates/video-upload')
const videos_subtitles = () =>
  import(
    /* webpackChunkName: "group-video" */ '@/hub/templates/video-subtitles'
  )
const history_info = () =>
  import(/* webpackChunkName: "group-history" */ '@/hub/templates/history-info')

const NotFoundComponent = () => import('@/hub/templates/NotFoundComponent')

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
    next(`/`)
  } else {
    store.commit('SET_HEADER_AUTH')
    store
      .dispatch('GET_MY_PROFILE')
      .then(() => {
        next(`/`)
      })
      .catch((err) => next('/login'))
  }
}

const checkAuthAndAccess = async (to, from, next) => {
  if (store.getters.hasToken) {
    store.commit('SET_HEADER_AUTH')
    store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
    try {
      if (Object.keys(store.getters.me.profile).length === 0) {
        await store.dispatch('GET_MY_PROFILE')
        console.log('ifAuthenticated - ok')
      }
      if (to.matched.some((record) => record.meta.notForUser)) {
        const {irole} = store.getters.me.profile
        if (irole === 'user') {
          next('/pageNotFound')
        } else {
          //store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
          next()
        }
      } else {
        //store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
        next()
      }
    } catch {
      console.log('ifAuthenticated - err')
      next('/login')
    }
  } else {
    next('/login')
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

// Router.beforeEach((to, from, next) => {
//   console.log('Router.beforeEach')
//   next()
// })

const router = new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'Home',
    //   redirect: '/login'
    // },
    {
      path: '/',
      name: 'hub',
      component: Hub,
      redirect: '/videos',
      meta: {requiresAuth: true},
      children: [
        {
          path: 'videos',
          component: videos,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/videos', requiresAuth: true}
        },
        {
          path: 'videos_player/uuid/:uuid',
          component: videos_player,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/videos', requiresAuth: true}
        },
        {
          path: 'videos_upload',
          component: videos_upload,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/videos', notForUser: 'true', requiresAuth: true}
        },
        {
          path: 'videos_subtitles/uuid/:uuid',
          component: videos_subtitles,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/videos', notForUser: 'true', requiresAuth: true}
        },
        {
          path: 'users',
          component: users,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/users', notForUser: 'true', requiresAuth: true},
          beforeEnter: checkAuthAndAccess
        },
        {
          path: 'users_add',
          component: users_add,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/users', notForUser: 'true', requiresAuth: true},
          props: {oper: 'add'}
        },
        {
          path: 'users_edit/uid/:uid',
          component: users_edit,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/users', notForUser: 'true', requiresAuth: true},
          props: {oper: 'edit'}
        },
        {
          path: 'groups',
          component: groups,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/groups', notForUser: 'true', requiresAuth: true}
        },
        {
          path: 'groups_add',
          component: groups_add,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/groups', notForUser: 'true', requiresAuth: true},
          props: {oper: 'add'}
        },
        {
          path: 'groups_edit/gid/:gid',
          component: groups_edit,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/groups', notForUser: 'true', requiresAuth: true},
          props: {oper: 'edit'}
        },
        {
          path: 'series',
          component: series,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/series', notForUser: 'true', requiresAuth: true}
        },
        {
          path: 'binding',
          component: binding,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/binding', notForUser: 'true', requiresAuth: true}
        },
        {
          path: 'series_add',
          component: series_add,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/series', notForUser: 'true', requiresAuth: true},
          props: {oper: 'add'}
        },
        {
          path: 'series_edit/sid/:sid',
          component: series_edit,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/series', notForUser: 'true', requiresAuth: true},
          props: {oper: 'edit'}
        },
        {
          path: 'messages',
          component: messages,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/messages', requiresAuth: true}
        },
        {
          path: 'roles',
          component: roles,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/roles', notForUser: 'true', requiresAuth: true}
        },
        {
          path: 'roles_add',
          component: roles_add,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/roles', notForUser: 'true', requiresAuth: true},
          props: {oper: 'add'}
        },
        {
          path: 'roles_edit/rid/:rid',
          component: roles_edit,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/roles', notForUser: 'true', requiresAuth: true},
          props: {oper: 'edit'}
        },
        {
          path: 'screen',
          component: screen,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/screen', notForUser: 'true', requiresAuth: true}
        },
        {
          path: 'history',
          component: history_info,
          //beforeEnter: checkAuthAndAccess,
          meta: {menuItem: '/history', notForUser: 'true', requiresAuth: true}
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
    },
    {
      path: '*',
      //component: NotFoundComponent
      redirect: '/pageNotFound'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})

router.beforeEach((to, from, next) => {
  console.log('to.matched: ', to.matched)
  if (!to.meta.requiresAuth) {
    return next()
  }
  const context = {
    to,
    from,
    next
  }
  checkAuthAndAccess(to, from, next)
  //next()
})

export default router
