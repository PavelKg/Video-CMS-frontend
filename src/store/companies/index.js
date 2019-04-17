import Api from '@/api'
const count = 10

export default {
  state: {
    companies: [],
    active_company_id: null,
    roles: {
      list: [],
      isLoading: false
    }
  },
  actions: {
    async LOAD_ROLES({commit}, _cid) {
      try {
        const result = await Api.roles(_cid)
        console.log('result=', result)        
      } catch (err) {
        console.log('role-err', err)
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
    }
  },
  getters: {
    companies_list: state => state.company,
    active_company: state =>
      state.companies.find(item =>
        item.id === state.active_company_id ? true : false
      ),
    active_company_id: state => state.active_company_id,
    roles: state => state.roles.list
  }
}
