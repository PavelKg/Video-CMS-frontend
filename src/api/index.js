import axios from 'axios'
import axiosGcs from 'axios'
import store from '../store'
import router from '../router'

const {VUE_APP_BACK_SERVER} = process.env
const API_ROOT = VUE_APP_BACK_SERVER
//const API_ROOT = 'https://botkg.ga/api'
//const API_ROOT = 'https://vcms.pepex.kg/api'
//const API_ROOT = 'http://127.0.0.1:8769/api'

const Api = axios.create({
  baseURL: API_ROOT,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    Authorization: ``
  }
})

// Add a response interceptor
Api.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response
  },
  async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const message = error.response.data.message.toLowerCase()

    // if (error.response.status === 401) {
    //   router.replace('/login');
    // }
    // return Promise.reject(error.response);
    console.log('error in the interceptors=', message)
    // authorization token expired
    if (/token expired|invalid token]/gi.test(message)) {
      console.log('token expired=', message)
      localStorage.removeItem('vcms-token')
      delete error.config.headers.Authorization
      store.commit('AUTH_LOGOUT')
      router.push(`/login`)
    }
    return Promise.reject(error)
  }
)

const type_json = {'Content-Type': 'application/json'}
const type_formdata = {'Content-Type': 'multipart/form-data'}

export default {
  setHeaderAuth(token) {
    Api.defaults.headers['Authorization'] = `Bearer ${token}`
  },

  delHeaderAuth(token) {
    delete Api.defaults.headers.common['Authorization']
  },
  /** Auth management */
  login(data) {
    const {personalId, password} = data
    return Api.post(`/users/login`, {
      username: personalId,
      password
    })
  },

  logout() {
    if (Api.defaults.headers['Authorization']) {
      return Api.post(`/users/logout`)
    }
    return false
  },

  my_profile() {
    return Api.get(`/users/me`, {
      headers: {
        ...type_json
      }
    })
  },

  load_user_menu() {
    return Api.get(`/users/menu`, {
      headers: {
        ...type_json
      }
    })
  },

  my_company_info() {
    return Api.get(`/users/company`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Password recovery
   * @param {string} email - user's email
   * @param {string} locale - user locale
   * @return {Promise<*>} - 202	Accepted
   * @throws Error
   */

  password_reset_request(payload) {
    const {email, locale} = payload
    return Api.post(
      `/users/password-reset-request`,
      {email, locale},
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** Save new Password (recovery)
   * @param {string} token - temporary token
   * @param {password} password - new user password
   * @return {Promise<*>} - 200	Accepted
   * @throws Error
   */

  save_req_pass(token, password) {
    return axios.put(
      `${API_ROOT}/users/password`,
      {password, token},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
  },

  /*  ---------  COMPANIES MANAGEMENT  ---------------------*/
  /** */
  /** get Video Info Location
   * @param {string} cid - Company ID
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  getVideoInfoLocation(cid) {
    return Api.get(`/companies/${cid}/mng/videoinfolocation`, {
      headers: {
        ...type_json
      }
    })
  },

  /** update Company CommentBox State
   * @param {string} cid - Company ID
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  setVideoInfoLocation(cid, location) {
    const newLocation = location === 'next' ? 'next' : 'bottom'
    return Api.put(`/companies/${cid}/mng/videoinfo${newLocation}location`, {
      headers: {
        ...type_json
      }
    })
  },

  /** get Company CommentBox State
   * @param {string} cid - Company ID
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  getCompanyCommentBoxState(cid) {
    return Api.get(`/companies/${cid}/mng/commentbox`, {
      headers: {
        ...type_json
      }
    })
  },

  /** update Company CommentBox State
   * @param {string} cid - Company ID
   * @param {string} state - new state
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  updCompanyCommentBoxState(cid, state) {
    return Api.put(`/companies/${cid}/mng/commentbox/${state}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** get Company Logo
   * @param {string} cid - Company ID
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  getCompanyLogo(cid) {
    return Api.get(`/companies/${cid}/mng/logo`, {
      headers: {
        ...type_json
      }
    })
  },
  /** update Company Logo
   * @param {string} cid - Company ID
   * @param {string} data - Logo data
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  updCompanyLogo(cid, data) {
    return Api.put(`/companies/${cid}/mng/logo`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------  ROLES MANAGEMENT  ---------------------*/
  /** Roles management
   *
   */

  roles(cid, filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/companies/${cid}/roles${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  role_info(cid, rid) {
    return Api.get(`/companies/${cid}/roles/${rid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Load sysytem features
   * @param {integer} cid - Company ID
   * @return {Promise<*>}[] - 200	Default Response
   * @throws Error
   */

  load_features(cid) {
    return Api.get(`/companies/${cid}/roles/features`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add new role
   * @param {string} cid - Company ID
   * @param {object} data - {"rid": "string", "name": "string", "is_admin": true, "permits": {} }
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  role_add(cid, data) {
    return Api.post(`/companies/${cid}/roles/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd role
   * @param {string} target - {cid, rid}
   * @param {object} data - {"name": "string", "is_admin": true }
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  role_upd(target, data) {
    const {cid, rid} = target
    return Api.put(`/companies/${cid}/roles/${rid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del role
   * @param {string} target - {cid, rid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  role_del(target) {
    const {cid, rid} = target
    return Api.delete(`/companies/${cid}/roles/${rid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------  GROUPS MANAGEMENT  ---------------------*/
  /** List of groups
   * @param {*} cid 
   * @returns {Promise<*>} - 200 List of groups
   * [{
    "gid": "string",
    "name": "string",
    "deleted_at": "string"
  }]
 */
  groups(cid, filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/companies/${cid}/groups${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Group Info
   * @param {number} cid 
   * @param {string} gid 
   * @returns {Promise<*>} - 200 group object
   * {
        "gid": "string",
        "cid": "string",
        "name": "string",
        "deleted_at": "string"
      }
 */
  group_info(cid, gid) {
    return Api.get(`/companies/${cid}/groups/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Group parents
   * @param {number} cid 
   * @param {string} gid 
   * @returns {Promise<*>} - 200 group object
   * {
      "gid": 0,
      "name": "string"
   * }
 */
  group_parents(cid, filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/companies/${cid}/groups/parents${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add new group
   * @param {string} cid - Company ID
   * @param {object} data - {"gid": "string", "name": "string" }
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  group_add(cid, data) {
    return Api.post(`/companies/${cid}/groups/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd group
   * @param {string} target - {cid, gid}
   * @param {object} data - {"name": "string" }
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  group_upd(target, data) {
    const {cid, gid} = target
    return Api.put(`/companies/${cid}/groups/${gid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del group
   * @param {string} target - {cid, gid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  group_del(target) {
    const {cid, gid} = target
    return Api.delete(`/companies/${cid}/groups/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add group series
   * @param {integer, integer, integer} target - {cid, gid, sid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  group_series_add(target) {
    const {cid, gid, sid} = target
    return Api.put(`/companies/${cid}/groups/${gid}/add-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del group series
   * @param {integer, integer, integer} target - {cid, gid, sid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  group_series_del(target) {
    const {cid, gid, sid} = target
    return Api.put(`/companies/${cid}/groups/${gid}/delete-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Groups list with binding series
   * @param {integer, integer} target - {cid, sid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  group_bind_series(target) {
    const {cid, sid} = target
    return Api.get(`/companies/${cid}/groups/bind-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------  COURSES MANAGEMENT  ---------------------*/
  /** List of courses
   * @param {*} filter 
   * @returns {Promise<*>} - 200 List of groups
   * [{
    "name": "string",
    "title": "string",
    "deleted_at": "string"
  }]
 */
  courses(filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/companies/courses${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Catalog of courses
   * @param {*} category
   * @returns {Promise<*>} - 200
   * category:['catalog', 'in-progress', 'completed']
   */
  courses_catalog(category) {
    return Api.get(`/companies/courses/${category}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Course Info
   * @param {string} name 
   * @returns {Promise<*>} - 200 group object
   * {
        "name": "string",
        "title": "string",
        "deleted_at": "string"
      }
 */
  course_info(name) {
    return Api.get(`/companies/courses/${name}`, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {string} name
   * @returns {Promise<[{}]>} - 200 section object
   */
  course_sections(name) {
    return Api.get(`/companies/courses/${name}/sections`, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {integer} cid
   * @param  {integer} secid
   * @returns {Promise<[{}]>} - 200 module object
   */
  course_section_modules(cid, secid) {
    return Api.get(`/companies/${cid}/course-sections/${secid}/modules`, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {integer} cid
   * @param  {integer} modid
   * @returns {Promise<[{}]>} - 200 module object
   */
  course_module_lessons(cid, modid) {
    return Api.get(`/companies/${cid}/course-modules/${modid}/lessons`, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {} cid
   * @param  {} secid
   * @returns {Promise<{}>} - 200 section object
   */
  course_section_info(cid, secid) {
    return Api.get(`/companies/${cid}/course-sections/${secid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {} cid
   * @param  {} modid
   * @returns {Promise<{}>} - 200 section object
   */
  course_module_info(cid, modid) {
    return Api.get(`/companies/${cid}/course-modules/${modid}`, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {number} cid
   * @param  {object} data
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */

  course_section_add(cid, data) {
    return Api.post(`/companies/${cid}/course-sections/`, data, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {object} target
   * @param  {object} data
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  course_section_upd(target, data) {
    const {cid, secid} = target
    return Api.put(`/companies/${cid}/course-sections/${secid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {number} cid
   * @param  {object} data
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */

  course_module_add(cid, data) {
    return Api.post(`/companies/${cid}/course-modules/`, data, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {object} target
   * @param  {object} data
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  course_module_upd(target, data) {
    const {cid, modid} = target
    return Api.put(`/companies/${cid}/course-modules/${modid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {object} target
   * @param  {object} data
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  course_module_upd(target, data) {
    const {cid, modid} = target
    return Api.put(`/companies/${cid}/course-modules/${modid}`, data, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {object} target
   * @param  {object} data
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */ course_module_upd(target, data) {
    const {cid, modid} = target
    return Api.put(`/companies/${cid}/course-modules/${modid}`, data, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {object} target
   * @param  {object} data
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */ course_module_upd(target, data) {
    const {cid, modid} = target
    return Api.put(`/companies/${cid}/course-modules/${modid}`, data, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {object} target
   * @param  {object} data
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */ course_module_lessons_upd(target, data) {
    const {cid, modid} = target
    return Api.put(`/companies/${cid}/course-modules/${modid}/lessons`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add new course
   * @param {object} data - {"name": "string" }
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  course_add(data) {
    return Api.post(`/companies/courses/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd course
   * @param {object} data - {"name": "string", "details":"string", "is_published":"string", "tags":"string" }
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  course_upd(target, data) {
    const {name} = target
    return Api.put(`/companies/courses/${name}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del course
   * @param {string} name
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  course_del(name) {
    return Api.delete(`/companies/courses/${name}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** course apply
   * @param {string} name
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  course_apply(name) {
    return Api.post(`/companies/courses/${name}/apply`, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {} name
   * @param  {} data
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   *
   */
  course_section_list_upd(name, data) {
    return Api.put(`/companies/courses/${name}/sections`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /**
   * @param  {} target
   * @param  {} data
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   *
   */
  section_module_list_upd(target, data) {
    const {cid, secid} = target
    return Api.put(`/companies/${cid}/course-sections/${secid}/modules`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------  TESTS MANAGEMENT  ---------------------*/
  /** List of tests
   * @param {string} filter
   * @returns {Promise<*>} - 200 List of tests
   */
  tests(filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/companies/tests${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },
  /**
   * @param  {string} uuid
   * @returns {Promise<*>} - 200
   */
  test_info(uuid) {
    return Api.get(`/companies/tests/${uuid}`, {
      headers: {
        ...type_json
      }
    })
  },
  /** Add new test
   * @param {object} data
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  test_add(data) {
    return Api.post(`/companies/tests/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd test
   * @param {string} uuid
   * @param {object} data
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  test_upd(uuid, data) {
    return Api.put(`/companies/tests/${uuid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del test
   * @param {string} uuid
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  test_del(uuid) {
    return Api.delete(`/companies/tests/${uuid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------  SERIES MANAGEMENT  ---------------------*/
  /** List of series
   * @param {integer} cid
   * @param {string} filter
   * @returns {Promise<*>} - 200 List of series
   * [{
    "sid": 0,
    "name": "string",
    "deleted_at": "string"
    }]
 */
  series(cid, filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/companies/${cid}/series${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Series Info
 * @param {number} cid 
 * @param {string} sid 
 * @returns {Promise<*>} - 200 series object
 * {
    "sid": 0,
    "cid": "string",
    "name": "string",
    "deleted_at": "string",
    "period_type": "string",
    "activity_start": "string",
    "activity_finish": "string"
    }
*/
  series_info(cid, sid) {
    return Api.get(`/companies/${cid}/series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add new series
   * @param {string} cid - Company ID
   * @param {object} data -
   * {
   * "name": "string",
   * "period_type": "string",
   * "activity_start": "string",
   * "activity_finish": "string"
   * }
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  series_add(cid, data) {
    return Api.post(`/companies/${cid}/series/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd series
   * @param {string} target - {cid, gid}
   * @param {object} data - {
   * "name": "string",
   * "period_type": "string",
   * "activity_start": "string",
   * "activity_finish": "string"
   * }
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  series_upd(target, data) {
    const {cid, sid} = target
    return Api.put(`/companies/${cid}/series/${sid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del series
   * @param {string} target - {cid, sid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  series_del(target) {
    const {cid, sid} = target
    return Api.delete(`/companies/${cid}/series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------  USERS MANAGEMENT  ---------------------*/
  /** List of users
   * @param {string} cid
   * @param {string} filter
   * @returns {Promise<*>} - 200 List of users
   * [{
    "gid": "string",
    "name": "string",
    "deleted_at": "string"
  }]
 */
  users(cid, filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/companies/${cid}/users/${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** User data
   * @param {string} cid
   * @param {string} uid
   * @returns {Promise<*>} - 200 User data
   * {
      "uid": "string",
      "fullname": "string",
      "gid": "string",
      "group_name": "string",
      "rid": "string",
      "email": "string",
      "deleted_at": "string",
      "last_login": "string"
    }
 */
  user_info(cid, uid) {
    return Api.get(`/companies/${cid}/users/${uid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** user telegram status
   * @param {string} cid
   * @param {string} uid
   * @returns {Promise<*>} - 200 
   * {
      "result": "boolean",
    }
 */
  user_telegram_status(cid, uid) {
    return Api.get(`/companies/${cid}/users/${uid}/telegram-status`, {
      headers: {
        ...type_json
      }
    })
  },
  /** Import new users
   * @param {string} cid - Company ID
   * @param {file} file - {"file": "file",  }
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  user_import(cid, file) {
    const formData = new FormData()
    formData.append('userlist', file)
    return Api.post(`/companies/${cid}/users/import`, formData, {
      headers: {
        ...type_formdata
      }
    })
  },

  /** Add new user
   * @param {string} cid - Company ID
   * @param {object} data - {"uid": "string", "name": "string" }
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  user_add(cid, data) {
    return Api.post(`/companies/${cid}/users/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd user
   * @param {string} target - {cid, uid}
   * @param {object} data - {"name": "string" }
   * @return {Promise<*>} - 201	Default Response
   * @throws Error
   */
  user_upd(target, data) {
    const {cid, uid} = target
    return Api.put(`/companies/${cid}/users/${uid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del user
   * @param {string} target - {cid, uid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  user_del(target) {
    const {cid, uid} = target

    return Api.delete(`/companies/${cid}/users/${uid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------  MESSAGES MANAGEMENT  ---------------------*/
  /** List of messages
   * @param {string} filter
   * @returns {Promise<*>} - 200 List of messages
   *  [{
    "mid": 0,
    "cp_uid": "string",
    "cp_cid": "string",
    "cp_cname": "string",
    "subject": "string",
    "text": "string",
    "starred": true,
    "created_at": "string",
    "deleted_at": "string"
  }]
 */
  messages(direction, filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/messages/${direction}/${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** List of messages receivers
   * @returns {Promise<*>} - 200 List of messages receivers
   *  [
        {
          "uid": "string",
          "cid": "string"
        }
      ]
 */
  receivers(filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/messages/receivers${setFilter}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add new message
   * @param {object} body - 
   * {
      "receiver_cid": "string",
      "receiver_uid": "string",
      "subject": "string",
      "text": "string",
      "important": false
      }
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  message_add(data) {
    return Api.post(`/messages/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del message
   * @param {object} - 
   * {
      "direction": "string" - [inbox|outbox],
      "mid": "numeric"
      }
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  message_del(payload) {
    const {direction, mid} = payload
    return Api.delete(`/messages/${direction}/${mid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** starred message
   * @param {string} mid - Message ID
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  message_starred(mid) {
    return Api.post(`/messages/${mid}/star`, {
      headers: {
        ...type_json
      }
    })
  },

  /** unstarred message
   * @param {string} mid - Message ID
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  message_unstarred(mid) {
    return Api.delete(`/messages/${mid}/star`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ---------------- FILES ---------------------------*/
  /** List of files
   * @param {string} filter
   * @param {string} limit
   * @param {string} offset
   * @returns {Promise<*>} - 200 List of messages
   *  [{
        "Fid": "number",
        "file_filename": "string",
        "file_uuid": "string",
        "file_status": "string",
        "file_thumbnail": "string" - BASE64,,
        "file_title": "string",
        "file_tag": "string",
        "file_description": "string",
        "file_public": "boolean",
        "file_type": "string"
        "created_at": "data",
        "updated_at": "data",
        "deleted_at": "data or null"
  }]
 */
  file_catalog({cid}, {filter, offset = 0, limit}) {
    const setFilter = !filter ? '' : `&filter=${filter}`
    const setLimit = !limit ? '' : `&limit=${limit}`
    const setOffset = `&offset=${offset}`

    return Api.get(
      `/companies/${cid}/files/catalog?${setFilter}${setLimit}${setOffset}`,
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** Get file info by uuid
   * @param {cid} cid
   * @param {uuid} uuid
   * @returns {Promise<*>} - 200 file info
   *  {
      "file_uuid": "string",
      "file_filename": "string",
      "file_status": "string",
      "file_thumbnail": "string",
      "file_title": "string",
      "file_tag": "string",
      "file_description": "string",
      "file_public": true,
      "file_type":"string",
      "created_at": "string",
      "updated_at": "string",
      "deleted_at": "string"
    }
  */
  file_info_by_uuid({cid, uuid}) {
    return Api.get(`/companies/${cid}/files/${uuid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** update file public status
   * @param {number} - cid
   * @param {UUID} - uuid
   * @param {string} - value ['public', 'private']
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */

  file_update_public_status({cid, uuid, value}) {
    return Api.put(
      `/companies/${cid}/files/${uuid}/public`,
      {value},
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** delete file
   * @param {number} - cid
   * @param {string} - uuid
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */

  file_delete({cid, uuid}) {
    return Api.delete(`/companies/${cid}/files/${uuid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd video info
   * @param {number} - cid
   * @param {string} - uuid
   * @param {object} info_data - {"video_title": "string" ...}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */

  file_update_info({cid, uuid, info_data}) {
    return Api.put(`/companies/${cid}/files/${uuid}`, info_data, {
      headers: {
        ...type_json
      }
    })
  },
  /** Add file series
   * @param {integer, integer, integer} target - {cid, uuid, sid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  file_series_add(target) {
    const {cid, uuid, sid} = target
    return Api.put(`/companies/${cid}/files/${uuid}/add-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del file series
   * @param {integer, integer, integer} target - {cid, uuid, sid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  file_series_del(target) {
    const {cid, uuid, sid} = target
    return Api.put(`/companies/${cid}/files/${uuid}/delete-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add file group
   * @param {integer, integer, integer} target - {cid, uuid, gid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  file_group_add(target) {
    const {cid, uuid, gid} = target
    return Api.put(`/companies/${cid}/files/${uuid}/add-group/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del file group
   * @param {integer, integer, integer} target - {cid, uuid, gid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  file_group_del(target) {
    const {cid, uuid, gid} = target
    return Api.put(`/companies/${cid}/files/${uuid}/delete-group/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** File list with binding series
   * @param {integer, integer} target - {cid, sid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  file_bind_series(target) {
    const {cid, sid} = target
    return Api.get(`/companies/${cid}/files/bind-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Files list with binding group
   * @param {integer, integer} target - {cid, gid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  file_bind_group(target) {
    const {cid, gid} = target
    return Api.get(`/companies/${cid}/files/bind-group/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** add file player event to log
   * @param {number} - cid
   * @param {UUID} - uuid
   * @param {string} - value 
   * {
        "event_action":"suspended",
        "event_data":{"type":"pause", "time":"33sec"},
        "event_result":"s",
        "event_details":"Pause (00:00:33)"
      }
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */

  file_add_player_event({cid, uuid, event_data}) {
    return Api.post(
      `/companies/${cid}/files/${uuid}/player-event`,
      {...event_data},
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /* ------------ VIDEOS ----------------------------*/
  /**  */

  /** Get GCS Signed Url
   * @param {cid} cid
   * @param {params} {name, type, size, uuid} 
   * @type {params} type of file [videos, files] 
   * @returns {Promise<*>} - 200 List of Signed url
   *  [{
      "name": "string",
      "url": "string",
      "uuid": "string",
  }]
 */
  getGcsSignedUrl(cid, params, type) {
    return Api.get(
      `/companies/${cid}/${type}/gcs-upload-surl`,
      {
        params: params
      },
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  upload_files(url, file, progress) {
    //console.log('file=', file)
    //progress_handler(0)
    progress.percent = 0
    return axiosGcs({
      method: 'PUT',
      url: url,
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: function(progressEvent) {
        progress.percent = parseInt(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        )
      },
      data: file
    })
  },

  /** List of videos
   * @param {string} filter
   * @param {string} limit
   * @param {string} offset
   * @returns {Promise<*>} - 200 List of messages
   *  [{
        "vid": "number",
        "video_filename": "string",
        "video_uuid": "string",
        "video_status": "string",
        "video_thumbnail": "string" - BASE64,,
        "video_title": "string",
        "video_tag": "string",
        "video_description": "string",
        "video_public": "boolean",
        "created_at": "data",
        "updated_at": "data",
        "deleted_at": "data or null"
  }]
 */
  videos_catalog({cid}, {filter, offset = 0, limit}) {
    const setFilter = !filter ? '' : `&filter=${filter}`
    const setLimit = !limit ? '' : `&limit=${limit}`
    const setOffset = `&offset=${offset}`

    return Api.get(
      `/companies/${cid}/videos/catalog?${setFilter}${setLimit}${setOffset}`,
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** Get video info by uuid
   * @param {cid} cid
   * @param {uuid} uuid
   * @returns {Promise<*>} - 200 video info
   *  {
      "video_uuid": "string",
      "video_filename": "string",
      "video_status": "string",
      "video_thumbnail": "string",
      "video_title": "string",
      "video_tag": "string",
      "video_description": "string",
      "video_public": true,
      "created_at": "string",
      "updated_at": "string",
      "deleted_at": "string"
    }
  */
  video_info_by_uuid({cid, uuid}) {
    return Api.get(`/companies/${cid}/videos/${uuid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Get video thumbnail by uuid
   * @param {cid} cid
   * @param {uuid} uuid
   * @returns {Promise<*>} - 200 video info
   *  {
      "video_uuid": "string",
      "video_thumbnail": "string",
    }
  */
  video_thumbnail_by_uuid({cid, uuid}) {
    return Api.get(`/companies/${cid}/videos/${uuid}/thumbnail`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd video info
   * @param {number} - cid
   * @param {string} - uuid
   * @param {object} info_data - {"video_title": "string" ...}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */

  video_update_info({cid, uuid, info_data}) {
    return Api.put(`/companies/${cid}/videos/${uuid}`, info_data, {
      headers: {
        ...type_json
      }
    })
  },

  /** delete video
   * @param {number} - cid
   * @param {string} - uuid
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */

  video_delete({cid, uuid}) {
    return Api.delete(`/companies/${cid}/videos/${uuid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add video series
   * @param {integer, integer, integer} target - {cid, uuid, sid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  video_series_add(target) {
    const {cid, uuid, sid} = target
    return Api.put(`/companies/${cid}/videos/${uuid}/add-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del video series
   * @param {integer, integer, integer} target - {cid, uuid, sid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  video_series_del(target) {
    const {cid, uuid, sid} = target
    return Api.put(`/companies/${cid}/videos/${uuid}/delete-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add video group
   * @param {integer, integer, integer} target - {cid, uuid, gid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  video_group_add(target) {
    const {cid, uuid, gid} = target
    return Api.put(`/companies/${cid}/videos/${uuid}/add-group/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Del video group
   * @param {integer, integer, integer} target - {cid, uuid, gid}
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */
  video_group_del(target) {
    const {cid, uuid, gid} = target
    return Api.put(`/companies/${cid}/videos/${uuid}/delete-group/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** update video status
   * @param {number} - cid
   * @param {UUID} - uuid
   * @param {string} - value
   * @param type  - type of file [videos, files]
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */

  uploaded_update_status({cid, uuid, value}, type) {
    return Api.put(
      `/companies/${cid}/${type}/${uuid}/status`,
      {value},
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** update video public status
   * @param {number} - cid
   * @param {UUID} - uuid
   * @param {string} - value ['public', 'private']
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */

  video_update_public_status({cid, uuid, value}) {
    return Api.put(
      `/companies/${cid}/videos/${uuid}/public`,
      {value},
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** add video player event to log
   * @param {number} - cid
   * @param {UUID} - uuid
   * @param {string} - value 
   * {
        "event_action":"suspended",
        "event_data":{"type":"pause", "time":"33sec"},
        "event_result":"s",
        "event_details":"Pause (00:00:33)"
      }
   * @return {Promise<*>} - 204	Default Response
   * @throws Error
   */

  video_add_player_event({cid, uuid, event_data}) {
    return Api.post(
      `/companies/${cid}/videos/${uuid}/player-event`,
      {...event_data},
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** Video list with binding series
   * @param {integer, integer} target - {cid, sid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  video_bind_series(target) {
    const {cid, sid} = target
    return Api.get(`/companies/${cid}/videos/bind-series/${sid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Videos list with binding group
   * @param {integer, integer} target - {cid, gid}
   * @return {Promise<*>} - 200	Default Response
   * @throws Error
   */
  video_bind_group(target) {
    const {cid, gid} = target
    return Api.get(`/companies/${cid}/videos/bind-group/${gid}`, {
      headers: {
        ...type_json
      }
    })
  },
  /* ------------ COMMENTS ----------------------------*/
  /** List of comments
   * @param {number} cid
   * @param {uuid} uuid
   * @param {string} filter
   * @param {string} limit
   * @param {string} offset
   * @returns {Promise<*>} - 200 List of messages
   *  [{
        "comment_video_uuid": "string",
        "comment_company_id": 0,
        "comment_id": 0,
        "comment_text": "string",
        "comment_visible": true,
        "comment_user_uid": "string",
        "created_at": "string",
        "updated_at": "string",
        "deleted_at": "string"
      }]
  */
  comments({cid, uuid}, {filter, offset = 0, limit}) {
    const setFilter = !filter ? '' : `&filter=${filter}`
    const setLimit = !limit ? '' : `&limit=${limit}`
    const setOffset = `&offset=${offset}`

    return Api.get(`/companies/${cid}/videos/${uuid}/comments`, {
      headers: {
        ...type_json
      }
    })
  },
  /** Add comment
   * @param {number} cid
   * @param {uuid} uuid
   * @returns {Promise<*>} - 200
   *  HEADERS: location →/api/companies/2/videos/b90c7920-0b66-4b49-8ee1-a2f76a37a228/comments/8
   */
  add_comment({cid, uuid, comment_text}) {
    return Api.post(
      `/companies/${cid}/videos/${uuid}/comments`,
      {comment_text},
      {
        headers: {
          ...type_json
        }
      }
    )
  },
  /** Get comment info
   * @param {number} cid
   * @param {uuid} uuid
   * @param {number} comid
   * @returns {Promise<*>} - 200
   */
  get_comment_info({cid, uuid, comid}) {
    return Api.get(`/companies/${cid}/videos/${uuid}/comments/${comid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Change comment visible
   * @param {number} cid
   * @param {uuid} uuid
   * @param {number} comid
   * @param {boolean} value *body
   * @returns {Promise<*>} - 200
   */
  comment_visible(payment) {
    const {cid, uuid, comid, value} = payment
    return Api.put(
      `/companies/${cid}/videos/${uuid}/comments/${comid}/visible`,
      {value},
      {
        headers: {
          ...type_json
        }
      }
    )
  },
  /** Delete comment
   * @param {number} cid
   * @param {uuid} uuid
   * @param {number} comid
   * @returns {Promise<*>} - 200
   */
  del_comment(payment) {
    const {cid, uuid, comid} = payment
    return Api.delete(`/companies/${cid}/videos/${uuid}/comments/${comid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ------------ SETTINGS ----------------------------*/
  /** Telegram login widget auth
   * @param {number} cid
   * @param {
   *  id: "integer",
   *  first_name "string",
   *  username: "string" ,
   *  auth_date "number",
   *  hash: "string"
   * } user
   * @returns {Promise<*>} - 201 or 500 User auth result
   *
   */
  telegram_auth_login(cid, user, botname) {
    return Api.post(`/companies/${cid}/telegram/login-auth/${botname}`, user, {
      headers: {
        ...type_json
      }
    })
  },

  /** Telegram deeplink auth
   * @param {number} cid
   * @param {string} botname
   * @returns {Promise<*>} - 200 or 500 User auth result
   * {url: "string"}
   */
  telegram_url_deeplink(cid, botname) {
    return Api.get(`/companies/${cid}/telegram/deeplink-auth/${botname}`, {
      headers: {
        ...type_json
      }
    })
  },

  /* ------------ HISTORY ----------------------------*/
  /** List of history categories
   * @param {string} filter
   * @returns {Promise<*>} - 200 List of history categories
   *  ["categoies_name": "string"]
   */
  historyCategories({filter, offset = 0, limit}) {
    const setFilter = !filter ? '' : `&filter=${filter}`
    const setLimit = !limit ? '' : `&limit=${limit}`
    const setOffset = `&offset=${offset}`

    return Api.get(`/history/categories?${setFilter}${setLimit}${setOffset}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** List of history category objects
   * @param {string} filter
   * @param {string} categories
   * @returns {Promise<*>} - 200 List of history category objects
   *  ["object_name": "string"]
   */
  historyCategoryObject(payload) {
    const {filter, offset = 0, limit, categories} = payload
    const setFilter = !filter ? '' : `&filter=${filter}`
    const setLimit = !limit ? '' : `&limit=${limit}`
    const setOffset = `&offset=${offset}`
    const setCategories = `&categories=${categories}`

    return Api.get(
      `/history/categories/objects?${setFilter}${setLimit}${setOffset}${setCategories}`,
      {
        headers: {
          ...type_json
        }
      }
    )
  },

  /** List of history list
   * @param {string} filter
   * @returns {Promise<*>} - 200 List of history 
   *  [ {
        "uid": String,
        "category": String,
        "action": String,
        "object": String,
        "result": String,
        "created_at": String
    }]
   */
  history_list(payload) {
    const {filter, offset = 0, limit} = payload
    const setFilter = !filter ? '' : `&filter=${filter}`
    const setLimit = !limit ? '' : `&limit=${limit}`
    const setOffset = `&offset=${offset}`

    return Api.get(`/history?${setFilter}${setLimit}${setOffset}`, {
      headers: {
        ...type_json
      }
    })
  }
}
