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
const videos_player = () =>
  import(/* webpackChunkName: "videos" */ '@/hub/templates/video-player')
const videos_upload = () =>
  import(/* webpackChunkName: "videos" */ '@/hub/templates/video-upload')
const videos_edit = () =>
  import(/* webpackChunkName: "videos" */ '@/hub/templates/video-props')

const files = () =>
  import(/* webpackChunkName: "files" */ '@/hub/templates/file-catalog')
const files_player = () =>
  import(/* webpackChunkName: "files" */ '@/hub/templates/file-player')
const files_upload = () =>
  import(/* webpackChunkName: "files" */ '@/hub/templates/file-upload')
const files_edit = () =>
  import(/* webpackChunkName: "files" */ '@/hub/templates/file-props')

const courses = () =>
  import(/* webpackChunkName: "courses" */ '@/hub/templates/courses')
const courses_catalog = () =>
  import(/* webpackChunkName: "courses" */ '@/hub/templates/courses/catalog')
const courses_add = () =>
  import(/* webpackChunkName: "courses" */ '@/hub/templates/courses/mng')
const courses_edit = () =>
  import(/* webpackChunkName: "courses" */ '@/hub/templates/courses/mng')
const course_section_add = () =>
  import(
    /* webpackChunkName: "courses" */ '@/hub/templates/courses/sections/mng'
  )
const course_section_edit = () =>
  import(
    /* webpackChunkName: "courses" */ '@/hub/templates/courses/sections/mng'
  )
const course_section_module_add = () =>
  import(
    /* webpackChunkName: "courses" */ '@/hub/templates/courses/sections/modules/mng'
  )
const course_section_module_edit = () =>
  import(
    /* webpackChunkName: "courses" */ '@/hub/templates/courses/sections/modules/mng'
  )

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
          path: 'files',
          component: files,
          meta: {
            menuItem: '/files',
            target: 'files',
            middleware: [requiresAuth]
          }
        },
        {
          path: 'files/upload',
          component: files_upload,
          meta: {
            menuItem: '/files',
            target: 'files/upload',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'files/edit/:uuid',
          component: files_edit,
          meta: {
            menuItem: '/files',
            target: 'files/edit',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'files/player/:uuid',
          component: files_player,
          meta: {
            menuItem: '/files',
            target: 'files/player',
            middleware: [requiresAuth]
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
        /** Courses */
        {
          path: 'courses',
          component: courses,
          meta: {
            menuItem: '/courses',
            target: 'courses',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: '/courses-(catalog|in-progress|completed)/',
          component: courses_catalog,
          meta: {
            menuItem: '/courses-catalog',
            target: 'courses-catalog',
            middleware: [requiresAuth, requiresAccess]
          }
        },
        {
          path: 'courses/add',
          component: courses_add,
          meta: {
            menuItem: '/courses',
            target: 'courses/add',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'add'}
        },
        {
          path: 'courses/edit/:name',
          component: courses_edit,
          meta: {
            menuItem: '/courses',
            target: 'courses/edit',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'edit'}
        },
        {
          path: 'course-section/add',
          component: course_section_add,
          meta: {
            menuItem: '/courses',
            target: 'courses/add',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'add'}
        },
        {
          path: 'course-section/edit/:secid',
          component: course_section_edit,
          meta: {
            menuItem: '/courses',
            target: 'courses/edit',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'edit'}
        },
        {
          path: 'course-module/add',
          component: course_section_module_add,
          meta: {
            menuItem: '/courses',
            target: 'courses/add',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'add'}
        },
        {
          path: 'course-module/edit/:modid',
          component: course_section_module_edit,
          meta: {
            menuItem: '/courses',
            target: 'courses/edit',
            middleware: [requiresAuth, requiresAccess]
          },
          props: {oper: 'edit'}
        },

        /**Series */

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
