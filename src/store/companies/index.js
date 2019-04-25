import Api from '@/api'
const count = 10

export default {
  state: {
    companies: [],
    active_company_id: null,
    roles: {
      list: null,
      isListLoading: false,
      selected: null
    }
  },
  actions: {
    async LOAD_ROLES({commit}, _cid) {
      try {
        commit('SET_ROLES_IS_LOADING', true)
        const result = await Api.roles(_cid)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_ROLES', result.data)
        } else {
          throw Error('Error load roles list')
        }
      } catch (err) {
        throw Error('Error request roles from server')
      } finally {
        commit('SET_ROLES_IS_LOADING', false)
      }

    },
    async LOAD_ROLE_DATA({commit}, payload) {
      try {
        const result = await Api.role_data(payload)
        if (result.data && result.status === 200) {
          commit('SET_ACTIVE_ROLE', result.data)
        } else {
          throw Error('Error load role data')
        }
      } catch (err) {
        console.log('load role-data', err)
      }
    }
  },
  mutations: {
    CREATE_COMPANY_LIST(state) {
      state.companies = []
      for (let i = 0; i < count; i += 1) {
        const company_item = {
          id: i,
          name: `Company-#${i}`,
          plan: Math.random() * 3,
          users_limit: Math.random() * 100,
          storage_limit: Math.random() * 30,
          enableSettings: true,
          contact_email: 'admin@company.co.jp'
        }
        state.companies.push(company_item)
      }
    },
    SET_ACTIVE_COMPANY(state, id) {
      state.active_company_id = id
    },
    SET_ROLES: (state, roles) => {
      state.roles.list = [...roles]
    },
    SET_ACTIVE_ROLE(state, role) {
      state.roles.selected = role
    },
    SET_ROLES_IS_LOADING(state, isload) {
      state.roles.isListLoading = isload
    }

  },
  getters: {
    companies_list: state => state.company,
    active_company: state =>
      state.companies.find(item =>
        item.id === state.active_company_id ? true : false
      ),
    active_company_id: state => state.active_company_id,
    roles: state => state.roles.list,
    role_selected: state => state.roles.selected,
    roles_is_list_loading: state => state.roles.isListLoading
  }
}
