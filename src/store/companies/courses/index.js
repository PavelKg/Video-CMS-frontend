import Api from '@/api'

export default {
  state: {
    list: [],
    isListLoading: false,
    selected: null
  },
  actions: {
    async LOAD_COURSES({commit}, payload) {
      const {cid, filter = ''} = payload
      try {
        commit('SET_COURSES_IS_LOADING', true)
        const result = await Api.courses(cid, filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_COURSES', result.data)
        } else {
          throw Error('Error load courses list')
        }
      } catch (err) {
        throw Error('Error request courses from server')
      } finally {
      }
    },
    async LOAD_COURSE_INFO({commit}, payload) {
      const {cid, crid} = payload
      try {
        const result = await Api.course_info(cid, crid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load courses list')
        }
      } catch (err) {
        throw Error('Error request courses from server')
      } finally {
      }
    },
    async LOAD_COURSE_SECTIONS({commit}, payload) {
      const {cid, crid} = payload
      try {
        const result = await Api.course_sections(cid, crid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load courses list')
        }
      } catch (err) {
        throw Error('Error request courses from server')
      } finally {
      }
    },
    async MODIFY_COURSE_SECTIONS({getters}, payload) {
      const cid = getters.me.profile.company_id
      const {crid, secid, act} = payload
      const target = {cid, crid}
      const data = {secid, act}
      try {
        const result = await Api.course_section_list_upd(target, data)
        if (result.status === 200) {
          return Promise.resolve('updated')
        } else {
          throw `Error course section list update, status - ${result.status} `
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_ADD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.course_add(cid, payload)
        if (result.status === 201) {
          return Promise.resolve('Coures added success')
        } else {
          throw Error(`Error add course, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_UPD({getters}, payload) {
      const cid = getters.me.profile.company_id
      const {crid, name, details, is_published, tags} = payload
      try {
        const result = await Api.course_upd(
          {cid, crid},
          {name, details, is_published, tags}
        )
        if (result.status === 200) {
          return Promise.resolve('Course updated success')
        } else {
          throw Error(`Error update course, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_DEL({getters}, crid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.course_del({cid, crid})
        if (result.status === 204) {
          return Promise.resolve('Coure updated success')
        } else {
          throw Error(`Error update course, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    }
  },
  mutations: {
    SET_COURSES: (state, courses) => {
      state.list = [...courses]
    },
    SET_ACTIVE_COURSE(state, course) {
      state.selected = course
    },
    SET_COURSES_IS_LOADING(state, isload) {
      state.isListLoading = isload
    }
  },
  getters: {
    courses: (state) => state.list,
    course_selected: (state) => state.selected,
    courses_is_loading: (state) => state.isListLoading
  }
}
