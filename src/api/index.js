import axios from 'axios'

const API_ROOT = 'https://vcms.pepex.kg/api'

const Api = axios.create({
  baseURL: API_ROOT,
  withCredentials: false,
  headers: {
    Accept: 'application/json',

    Authorization: `Bearer`
  }
})

const type_json = {'Content-Type': 'application/json'}

export default {
  setHeaderAuth(token) {
    Api.defaults.headers['Authorization'] = `Bearer ${token}`
  },

  delHeaderAuth(token) {
    delete Api.defaults.headers.common['Authorization']
  },

  login(data) {
    const {personalId, password} = data
    return Api.post(`/users/login`, {
      username: personalId,
      password
    })
  },

  my_profile() {
    return Api.get(`/users/me`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Roles management
   *
   */

  roles(cid) {
    return Api.get(`/companies/${cid}/roles`, {
      headers: {
        ...type_json
      }
    })
  },

  role_data(target) {
    const {cid, rid} = target
    return Api.get(`/companies/${cid}/roles/${rid}`, {
      headers: {
        ...type_json
      }
    })
  },

  /** Add new role
   * @param {string} cid - Company ID
   * @param {object} data - {"rid": "string", "name": "string", "is_admin": true }
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
  groups(cid) {
    return Api.get(`/companies/${cid}/groups`, {
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
    console.log('cid=', cid, data)
    return Api.post(`/companies/${cid}/groups/`, data, {
      headers: {
        ...type_json
      }
    })
  },

  /** Upd role
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

  /* ------------ VIDEOS ----------------------------*/
  /**  */
  upload_files(target, formData) {
    const {cid, uid} = target
    return Api.post(`/company/${cid}/users/${uid}/videos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
