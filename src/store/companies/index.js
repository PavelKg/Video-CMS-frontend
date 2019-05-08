
import Groups from './groups'
import Roles from './roles'
const count = 10

export default {
  modules: {Groups, Roles},
  state: {
    companies: [],
    active_company_id: null
  },
  actions: {
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
    }
  },
  getters: {
    companies_list: state => state.company,
    active_company: state =>
      state.companies.find(item =>
        item.id === state.active_company_id ? true : false
      ),
    active_company_id: state => state.active_company_id
  }
}
