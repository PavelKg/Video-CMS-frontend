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
  role_upd(target, data) {
    const {cid, rid} = target
    return Api.put(`/companies/${cid}/roles/${rid}`, data, {
      headers: {
        ...type_json
      }
    })
  },

  upload_files(target, formData) {
    const {cid, uid} = target
    return Api.post(`/company/${cid}/users/${uid}/videos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  // companies() {
  //   return Api.get(`/companies`)
  // },
  // company_upd(data) {
  //   const {compId, compData} = data
  //   return Api.put(`/companies`, {company_id: compId, company_data: compData})
  // },
  // company_add(data) {
  //   const {compData} = data
  //   return Api.post(`/companies`, {company_data: compData})
  // },
  // company_del(data) {
  //   const {compId} = data
  //   return Api.delete(`/companies`, {data: {company_id: compId}})
  // },
  // administrators() {
  //   return Api.get(`/administrators`)
  // },
  // user_upd(data) {
  //   const {userId, userData} = data
  //   return Api.put(`/administrators`, {user_id: userId, user_data: userData})
  // },
  // user_add(data) {
  //   const {userData} = data
  //   return Api.post(`/administrators`, {user_data: userData})
  // },
  // user_del(data) {
  //   const {userId} = data
  //   return Api.delete(`/administrators`, {data: {user_id: userId}})
  // },
  // videos(data) {
  //   return Api.get(`/videos/?params=${JSON.stringify(data)}`)
  // },
  // resumes(data) {
  //   return Api.get(`/resumes/?params=${JSON.stringify(data)}`)
  // }
}
