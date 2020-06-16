import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
import Hub from '../hub'
import Login from './login'
import RecoveryPassword from './recovery_password'
import multiguard from './middleware/multiguard'
import requiresAuth from './middleware/auth'
import requiresAccess from './middleware/access'

const videos = () =>
  import(/* webpackChunkName: "videos" */ '@/hub/templates/video-catalog')
const messages = () =>
  import(/* webpackChunkName: "messages" */ '@/hub/templates/messages')
const users = () =>
  import(/* webpackChunkName: "users" */ '@/hub/templates/users')
const users_add = () =>
  import(/* webpackChunkName: "users" */ '@/hub/templates/users/mng')
const users_edit = () =>
  import(/* webpackChunkName: "users" */ '@/hub/templates/users/mng')
const users_import = () =>
  import(/* webpackChunkName: "users" */ '@/hub/templates/users/import')
const groups = () =>
  import(/* webpackChunkName: "groups" */ '@/hub/templates/groups')
const groups_add = () =>
  import(/* webpackChunkName: "groups" */ '@/hub/templates/groups/mng')
const groups_edit = () =>
  import(/* webpackChunkName: "groups" */ '@/hub/templates/groups/mng')
const series = () =>
  import(/* webpackChunkName: "series" */ '@/hub/templates/series')
const series_add = () =>
  import(/* webpackChunkName: "series" */ '@/hub/templates/series/mng')
const series_edit = () =>
  import(/* webpackChunkName: "series" */ '@/hub/templates/series/mng')
const binding = () =>
  import(/* webpackChunkName: "binding" */ '@/hub/templates/binding')
const roles = () =>
  import(/* webpackChunkName: "roles" */ '@/hub/templates/roles')
const roles_add = () =>
  import(/* webpackChunkName: "roles" */ '@/hub/templates/roles/mng')
const roles_edit = () =>
  import(/* webpackChunkName: "roles" */ '@/hub/templates/roles/mng')
const screen = () =>
  import(/* webpackChunkName: "screen" */ '@/hub/templates/screen')
const videos_player = () =>
  import(/* webpackChunkName: "videos" */ '@/hub/templates/video-player')
const videos_upload = () =>
  import(/* webpackChunkName: "videos" */ '@/hub/templates/video-upload')
const videos_edit = () =>
  import(/* webpackChunkName: "videos" */ '@/hub/templates/video-subtitles')
const history_info = () =>
  import(/* webpackChunkName: "history" */ '@/hub/templates/history-info')
const settings = () =>
  import(/* webpackChunkName: "settings" */ '@/hub/templates/settings')

const notFoundComponent = () =>
  import(/* webpackChunkName: "settings" */ '@/hub/templates/NotFoundComponent')

Vue.use(Router)

const ifNotTokenRecovery = (to, from, next) => {
  const {token} = to.query
  if (token) {
    next()
  } else {
    next('/login')
  }
}

const clearAll = async (to, from, next) => {
  await store.dispatch('LOGOUT')
  next()
}
// const ifNotAuthenticated = (to, from, next) => {
//   if (!store.getters.hasToken) {
//     next()
//     //return
//   }
//   const isAuth = store.getters.authStatus === 'success'
//   if (isAuth) {
//     next(`/`)
//   } else {
//     store.commit('SET_HEADER_AUTH')
//     store
//       .dispatch('GET_MY_PROFILE')
//       .then(() => {
//         next(`/`)
//       })
//       .catch((err) => next('/login'))
//   }
// }

// const checkAccess = ({to, from, next}) => {
//   const {irole} = store.getters.me.profile
//   if (irole !== 'user') {
//     throw 'access denided'
//   }
//   // else {
//   //   next()
//   // }
// }
// const checkAuth = async ({to, from, next}) => {
//   if (store.getters.hasToken) {
//     store.commit('SET_HEADER_AUTH')
//     store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
//     try {
//       if (Object.keys(store.getters.me.profile).length === 0) {
//         await store.dispatch('GET_MY_PROFILE')
//       }
//     } catch {
//       throw 'ifAuthenticated - err'
//     }
//   } else {
//     throw 'ifAuthenticated - err'
//   }
// }

//const requiresAuth = checkAuth
//const requiresAccess = checkAccess

// const ifAuthenticated = (to, from, next) => {
//   if (store.getters.hasToken) {
//     store.commit('SET_HEADER_AUTH')
//     store.commit('ITEM_STATE', to.meta.menuItem ? to.meta.menuItem : '')
//     store
//       .dispatch('GET_MY_PROFILE')
//       .then(() => {
//         console.log('ifAuthenticated - ok')
//         next()
//       })
//       .catch((err) => {
//         console.log('ifAuthenticated - err')
//         next('/login')
//       })
//   } else {
//     next('/login')
//   }
// }

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
      meta: {middleware: [requiresAuth]},
      children: [
        {
          path: 'videos',
          component: videos,
          meta: {
            menuItem: '/videos',
            target: 'videos',
            middleware: [requiresAuth]
          }
        },
        {
          path: 'videos/player/:uuid',
          component: videos_player,
          meta: {
            menuItem: '/videos',
            target: 'videos/player',
            middleware: [requiresAuth]
          }
        },
        {
          path: 'videos/upload',
          component: videos_upload,
          meta: {
            menuItem: '/videos',
            target: 'videos/upload',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'videos/edit/:uuid',
          component: videos_edit,
          meta: {
            menuItem: '/videos',
            target: 'videos/edit',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'users',
          component: users,
          meta: {
            menuItem: '/users',
            target: 'users',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'users/add',
          component: users_add,
          meta: {
            menuItem: '/users',
            target: 'users/add',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'add'}
        },
        {
          path: 'users/import',
          component: users_import,
          meta: {
            menuItem: '/users',
            target: 'users/import',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'users/edit/:uid',
          component: users_edit,
          meta: {
            menuItem: '/users',
            target: 'users/edit',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'edit'}
        },
        {
          path: 'settings',
          component: settings,
          meta: {
            menuItem: '/settings',
            target: 'settings',
            middleware: [requiresAuth]
          }
        },
        {
          path: 'groups',
          component: groups,
          meta: {
            menuItem: '/groups',
            target: 'groups',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'groups/add',
          component: groups_add,
          meta: {
            menuItem: '/groups',
            target: 'groups/add',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'add'}
        },
        {
          path: 'groups/edit/:gid',
          component: groups_edit,
          meta: {
            menuItem: '/groups',
            target: 'groups/edit',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'edit'}
        },
        {
          path: 'series',
          component: series,
          meta: {
            menuItem: '/series',
            target: 'series',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'binding',
          component: binding,
          meta: {
            menuItem: '/binding',
            target: 'binding',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'series/add',
          component: series_add,
          meta: {
            menuItem: '/series',
            target: 'series/add',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'add'}
        },
        {
          path: 'series/edit/:sid',
          component: series_edit,
          meta: {
            menuItem: '/series',
            target: 'series/edit',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'edit'}
        },
        {
          path: 'messages',
          component: messages,
          meta: {
            menuItem: '/messages',
            target: 'messages',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'roles',
          component: roles,
          meta: {
            menuItem: '/roles',
            target: 'roles',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'roles/add',
          component: roles_add,
          meta: {
            menuItem: '/roles',
            target: 'roles/add',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'add'}
        },
        {
          path: 'roles/edit/:rid',
          component: roles_edit,
          meta: {
            menuItem: '/roles',
            target: 'roles/edit',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'edit'}
        },
        {
          path: 'company',
          component: screen,
          meta: {
            menuItem: '/company',
            target: 'company',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'history',
          component: history_info,
          meta: {
            menuItem: '/history',
            target: 'history',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'pageNotFound',
          component: notFoundComponent,
          meta: {
            target: 'pageNotFound',
            middleware: [requiresAuth]
          }
        }
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
      component: Login,
      beforeEnter: clearAll
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
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    store
  }

  return multiguard(middleware, context)
})

export default router
