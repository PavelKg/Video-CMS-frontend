import Api from '@/api'
import {get_uuid} from '../../helpers'

const data_types = {
  lessons: [{title: 'title', value: '', view: 'input', requered: true}],
  tasks: [
    {title: 'name', value: '', view: 'input', requered: true},
    {
      title: 'type',
      value: '',
      view: 'select',
      options: ['video', 'pdf', 'text', 'test', 'pptx'],
      requered: true
    },
    {title: 'target', value: '', view: 'input', requered: true}
  ]
}

export default {
  state: {},
  actions: {
    async LOAD_COURSE_MODULE_INFO({commit}, payload) {
      const {cid, modid} = payload
      try {
        const result = await Api.course_module_info(cid, modid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw 'Error load course module'
        }
      } catch (err) {
        throw 'Error request course module from server'
      } finally {
      }
    },

    async LOAD_COURSE_MODULE_DATA_TYPES({commit}) {
      try {
        return data_types
        //   const result = await Api.course_module_info(cid, modid)
        //   if (result.data && result.status === 200) {
        //     return result.data
        //   } else {
        //     throw 'Error load course module'
        //   }
      } catch (err) {
        throw 'Error request course module from server'
      } finally {
      }
    },

    async LOAD_MODULE_LESSONS({}, payload) {
      const {cid, modid} = payload
      try {
        const result = await Api.course_module_lessons(cid, modid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw 'Error load lessons list'
        }
      } catch (err) {
        throw 'Error request lessons from server'
      } finally {
      }
    },

    // async MODIFY_SECTION_MODULES({getters}, payload) {
    //   const cid = getters.me.profile.company_id
    //   const {secid, modid, act} = payload
    //   const target = {cid, secid}
    //   const data = {modid, act}
    //   try {
    //     const result = await Api.section_module_list_upd(target, data)
    //     if (result.status === 200) {
    //       return Promise.resolve('updated')
    //     } else {
    //       throw `Error section module list update, status - ${result.status} `
    //     }
    //   } catch (err) {
    //     throw err.response.data
    //   }
    // },

    async COURSE_MODULE_ADD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const options = {...payload, modid: get_uuid()}
      try {
        const result = await Api.course_module_add(cid, options)
        if (result.status === 201) {
          const loc = /.*\/(.*)/.exec(result.headers.location)
          return Promise.resolve(loc ? loc[1] : null)
        } else {
          throw `Error add course module, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_MODULE_UPD({getters}, payload) {
      const cid = getters.me.profile.company_id

      const {modid, instructor_note} = payload
      try {
        const result = await Api.course_module_upd(
          {cid, modid},
          {instructor_note}
        )

        if (result.status === 200) {
          return Promise.resolve('Course module updated success')
        } else {
          throw `Error update course module, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data
      }
    },

    async COURSE_MODULE_LESSONS_UPD({getters}, payload) {
      const cid = getters.me.profile.company_id

      const {modid, lessons} = payload

      try {
        const result = await Api.course_module_lessons_upd(
          {cid, modid},
          {lessons}
        )

        if (result.status === 200) {
          return Promise.resolve('Course module lessons updated success')
        } else {
          throw `Error update course module lessons, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_MODULE_DEL({getters}, modid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.course_module_del({cid, modid})
        if (result.status === 204) {
          return Promise.resolve('Course module updated success')
        } else {
          throw `Error update course module, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data.message.replace(/^Error:\s/gi, '')
      }
    }
  },
  mutations: {},
  getters: {}
}
