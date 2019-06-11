import axios from 'axios'
import axiosGcs from 'axios'

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

  /* ---------  USERS MANAGEMENT  ---------------------*/
  /** List of groups
   * @param {string} cid
   * @param {string} filter
   * @returns {Promise<*>} - 200 List of groups
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
      "sender": "string",
      "receiver": "string",
      "subject": "string",
      "text": "string",
      "important": true,
      "created_at": "string",
      "deleted_at": "string"
  }]
 */
  messages(filter) {
    const setFilter = !filter ? '' : `?filter=${filter}`
    return Api.get(`/messages/${setFilter}`, {
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

  /* ------------ VIDEOS ----------------------------*/
  /**  */

  /** Get GCS Signed Url
   * @param {array} - files list
   * @returns {Promise<*>} - 200 List of Signed url
   *  [{
      "name": "string",
      "size": "integer",
      "type": "string",
  }]
 */
  getGcsSignedUrl(params) {
    //console.log('params=', params)
    return Api.get(
      `/videos/gcs-upload-surl`,
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

  upload_files(url, file, progress_handler) {
    progress_handler(0)
    return axiosGcs({
      method: 'PUT',
      url: url,
      headers: {
        'Content-Type': file.type
      },
      onUploadProgress: function(progressEvent) {
        progress_handler(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        )
      },
      data: file
    })
  }
}
