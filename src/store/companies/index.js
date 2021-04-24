import Api from '@/api'
import Groups from './groups'
import Series from './series'
import Roles from './roles'
import Courses from './courses/'
import Course_sections from './courses/sections'
import Course_modeles from './courses/modules'

export default {
  modules: {Groups, Roles, Series, Courses, Course_sections, Course_modeles},
  state: {
    companies: [],
    active_company_id: null,
    company_logo: '',
    video_info_location: 'bottom'
  },
  actions: {
    async LOAD_VIDEO_INFO_LOCATION({commit}, cid) {
      try {
        const result = await Api.getVideoInfoLocation(cid)
        if (typeof result.data === 'object' && result.status === 200) {
          commit('SET_VIDEO_INFO_LOCATION', result.data.location)
        } else {
          throw Error('Error load company commentbox state')
        }
      } catch (err) {
        commit('SET_VIDEO_INFO_LOCATION', result.data.location)
        throw Error(`Error request commentbox state from server: ${err}`)
      } finally {
      }
    },
    async UPDATE_VIDEO_INFO_LOCATION({commit}, payload) {
      const {cid, location} = payload
      try {
        const result = await Api.setVideoInfoLocation(cid, location)

        if (result.status === 204) {
          commit('SET_VIDEO_INFO_LOCATION', location)
        } else {
          throw Error('Error load company commentbox state')
        }
      } catch (err) {
        throw Error(`Error request commentbox state from server: ${err}`)
      } finally {
      }
    },
    async LOAD_COMMENTBOX_STATE({commit}, cid) {
      try {
        const result = await Api.getCompanyCommentBoxState(cid)
        if (typeof result.data === 'object' && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load company commentbox state')
        }
      } catch (err) {
        throw Error(`Error request commentbox state from server: ${err}`)
      } finally {
      }
    },
    async UPDATE_COMMENTBOX_STATE({commit}, {cid, newState}) {
      try {
        const result = await Api.updCompanyCommentBoxState(cid, newState)
        if (result.status === 204) {
          return result.data
        } else {
          throw Error('Error update company commentbox state')
        }
      } catch (err) {
        throw Error(`Error update commentbox state from server: ${err}`)
      } finally {
      }
    },
    async LOAD_LOGO({commit}, cid) {
      try {
        const result = await Api.getCompanyLogo(cid)
        const {data} = result.data
        if (typeof result.data === 'object' && result.status === 200) {
          commit('SET_COMPANY_LOGO', data)
        } else {
          throw Error('Error load company logo')
        }
      } catch (err) {
        throw Error(`Error request logo from server: ${err}`)
      } finally {
      }
    },
    async SAVE_LOGO({commit}, {cid, logo_data}) {
      try {
        const result = await Api.updCompanyLogo(cid, {data: logo_data})
        if (result.status === 204) {
          commit('SET_COMPANY_LOGO', logo_data)
        } else {
          throw Error('Error save company logo')
        }
      } catch (err) {
        throw Error(`Error save logo on server: ${err}`)
      } finally {
      }
    }
  },
  mutations: {
    SET_COMPANY_LOGO(state, data) {
      state.company_logo = data
    },
    SET_VIDEO_INFO_LOCATION(state, location) {
      state.video_info_location = location
    }
    // CREATE_COMPANY_LIST(state) {
    //   state.companies = []
    //   for (let i = 0; i < count; i += 1) {
    //     const company_item = {
    //       id: i,
    //       name: `Company-#${i}`,
    //       plan: Math.random() * 3,
    //       users_limit: Math.random() * 100,
    //       storage_limit: Math.random() * 30,
    //       enableSettings: true,
    //       contact_email: 'admin@company.co.jp'
    //     }
    //     state.companies.push(company_item)
    //   }
    // },
    // SET_ACTIVE_COMPANY(state, id) {
    //   state.active_company_id = id
    // },
  },
  getters: {
    // companies_list: (state) => state.company,
    // active_company: (state) =>
    //   state.companies.find((item) =>
    //     item.id === state.active_company_id ? true : false
    //   ),
    // active_company_id: (state) => state.active_company_id
  }
}
