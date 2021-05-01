import Api from '@/api'

export default {
  state: {
    list: [],
    isListLoading: false,
    selected: null
  },
  actions: {
    async LOAD_COURSES({commit}, payload) {
      const {filter = ''} = payload
      try {
        commit('SET_COURSES_IS_LOADING', true)
        const result = await Api.courses(filter)
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
    async LOAD_COURSES_CATALOG({}, category) {
      try {
        const result = await Api.courses_catalog(category)
        if (Array.isArray(result.data) && result.status === 200) {
          return result.data
        } else {
          throw 'Error load courses catalog'
        }
      } catch (err) {
        throw 'Error request courses catalog from server'
      } finally {
      }
    },

    async LOAD_COURSE_INFO({commit}, payload) {
      const {name} = payload
      try {
        const result = await Api.course_info(name)
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
    async LOAD_COURSE_SECTIONS({}, payload) {
      const {name} = payload
      try {
        const result = await Api.course_sections(name)
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
    async MODIFY_COURSE_SECTIONS({}, payload) {
      const {course_name: name, secid, act} = payload
      const data = {secid, act}
      try {
        const result = await Api.course_section_list_upd(name, data)
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
      try {
        const result = await Api.course_add(payload)
        if (result.status === 201) {
          return Promise.resolve('Coures added success')
        } else {
          throw Error(`Error add course, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async COURSE_UPD({}, payload) {
      const {name, title, details, is_published, tags} = payload
      try {
        const result = await Api.course_upd(
          {name},
          {title, details, is_published, tags}
        )
        if (result.status === 200) {
          return Promise.resolve('Course updated success')
        } else {
          throw Error(`Error update course, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response
      }
    },
    async COURSE_DEL({getters}, name) {
      try {
        const result = await Api.course_del(name)
        if (result.status === 204) {
          return Promise.resolve('Coure updated success')
        } else {
          throw `Error update course, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data.message.replace(/^Error:\s/gi, '')
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
