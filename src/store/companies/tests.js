import Api from '@/api'
import {get_uuid} from '../helpers'

export default {
  state: {
    // list: [],
    // isListLoading: false,
    // selected: null
  },
  actions: {
    async LOAD_TESTS({commit}, payload) {
      const {filter = ''} = payload
      try {
        const {data, status} = await Api.tests(filter)
        if (Array.isArray(data) && status === 200) {
          return data
        } else {
          throw `Error load tests list, code:${status}`
        }
      } catch (err) {
        throw err.response.data
      } finally {
      }
    },
    async LOAD_TEST_INFO({}, payload) {
      const {uuid} = payload
      try {
        const {data, status} = await Api.test_info(uuid)
        if (data && status === 200) {
          return data
        } else {
          throw `Error load test data, status: ${status}`
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async TEST_ADD({}, payload) {
      try {
        const uuid = get_uuid()
        const {status} = await Api.test_add({...payload, uuid})
        if (status === 201) {
          return true
        } else {
          throw `Error add test, status: ${status}`
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async TEST_UPD({}, payload) {
      const {title, is_public, description, tags, thumbnail, uuid} = payload
      console.log(payload)
      try {
        const {status} = await Api.test_upd(uuid, {
          title,
          is_public,
          description,
          tags,
          thumbnail
        })
        if (status === 200) {
          return true
        } else {
          throw `Error update test, status: ${status}`
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async TEST_DEL({}, uuid) {
      try {
        const {status} = await Api.test_del(uuid)
        if (status === 204) {
          return true
        } else {
          throw `Error update role, status: ${status}`
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    }
  },
  mutations: {},
  getters: {}
}
