import Api from '@/api'
import {get_uuid} from '../../helpers'

export default {
  state: {},
  actions: {
    async LOAD_COURSE_SECTION_INFO({commit}, payload) {
      const {cid, secid} = payload
      try {
        const result = await Api.course_section_info(cid, secid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw 'Error load course section'
        }
      } catch (err) {
        throw 'Error request course section from server'
      } finally {
      }
    },

    async LOAD_SECTION_MODULES({}, payload) {
      const {cid, secid} = payload
      try {
        const result = await Api.course_section_modules(cid, secid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load modules list')
        }
      } catch (err) {
        throw Error('Error request modules from server')
      } finally {
      }
    },
    async MODIFY_SECTION_MODULES({getters}, payload) {
      const cid = getters.me.profile.company_id
      const {secid, modid, act} = payload
      const target = {cid, secid}
      const data = {modid, act}
      try {
        const result = await Api.section_module_list_upd(target, data)
        if (result.status === 200) {
          return Promise.resolve('updated')
        } else {
          throw `Error section module list update, status - ${result.status} `
        }
      } catch (err) {
        throw err.response.data
      }
    },

    async COURSE_SECTION_ADD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const options = {...payload, uuid: get_uuid()}
      try {
        const result = await Api.course_section_add(cid, options)
        console.log(result.headers.location)

        if (result.status === 201) {
          const loc = /.*\/(.*)/.exec(result.headers.location)

          return Promise.resolve(loc ? loc[1] : null)
        } else {
          throw Error(`Error add course section, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_SECTION_UPD({getters}, payload) {
      const cid = getters.me.profile.company_id

      const {uuid: secid, title, description, tags} = payload
      try {
        const result = await Api.course_section_upd(
          {cid, secid},
          {title, description, tags}
        )
        if (result.status === 200) {
          return Promise.resolve('Course section updated success')
        } else {
          throw Error(`Error update course section, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_SECTION_DEL({getters}, secid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.cour_sesection_del({cid, crid})
        if (result.status === 204) {
          return Promise.resolve('Course section updated success')
        } else {
          throw Error(`Error update course section, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    }
  },
  mutations: {},
  getters: {}
}
