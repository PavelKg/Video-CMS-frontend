import Api from '@/api'

function convertToCSV(objArray) {
  const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
  let str = ''

  for (let i = 0; i < array.length; i++) {
    let line = ''
    for (let index in array[i]) {
      if (line != '') line += ','
      line += array[i][index]
    }
    str += line + '\r\n'
  }
  return str
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers)
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items)

  var csv = convertToCSV(jsonObject)

  var exportedFilenmae = fileTitle + '.csv' || 'export.csv'

  var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae)
  } else {
    var link = document.createElement('a')
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', exportedFilenmae)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export default {
  state: {
    users: {
      list: [],
      isListLoading: true,
      selected: null
    },
    usersImportStatus: ''
  },
  actions: {
    async LOAD_USERS({commit}, payload) {
      const {cid, filter} = payload
      commit('SET_USERS_IS_LOADING', true)
      try {
        const result = await Api.users(cid, filter)
        if (Array.isArray(result.data) && result.status === 200) {
          commit('SET_USERS', result.data)
        } else {
          throw Error('Error load users list')
        }
      } catch (err) {
        throw Error('Error request users from server')
      } finally {
        //commit('SET_USERS_IS_LOADING', false)
      }
    },
    async LOAD_USER_INFO({commit}, payload) {
      const {cid, uid} = payload
      try {
        const result = await Api.user_info(cid, uid)
        if (result.data && result.status === 200) {
          return result.data
        } else {
          throw Error('Error load users list')
        }
      } catch (err) {
        throw Error('Error request users from server')
      } finally {
      }
    },
    async USER_IMPORT({commit, getters}, file) {
      const headers = {
        row: 'ROW',
        id: 'USER ID',
        result: 'RESULT'
      }
      const fileTitle = 'UsersImportResult'
      const cid = getters.me.profile.company_id
      commit('SET_IMPORT_STATUS', 'Processing...')
      try {
        const result = await Api.user_import(cid, file)
        if (result.status === 200) {
          commit('SET_IMPORT_STATUS', 'Generate result CSV')
          exportCSVFile(headers, result.data, fileTitle)
          commit('SET_IMPORT_STATUS', 'Import finished')
          return Promise.resolve()
        } else {
          commit('SET_IMPORT_STATUS', result.status)
          throw Error(`Error import user, status - ${result.status}`)
        }
      } catch (err) {
        commit(
          'SET_IMPORT_STATUS',
          err.response ? err.response.data.message : 'Import error'
        )
      }
    },
    async USER_ADD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id

      const {
        uid,
        fullname,
        rid,
        email,
        password,
        gids,
        activity_start,
        activity_finish
      } = payload

      try {
        const result = await Api.user_add(cid, {
          uid,
          fullname,
          rid,
          email,
          password,
          gids,
          activity_start,
          activity_finish
        })
        if (result.status === 201) {
          return Promise.resolve('User added success')
        } else {
          throw Error(`Error add user, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async USER_UPD({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {
        uid,
        fullname,
        gids,
        rid,
        email,
        password,
        activity_start,
        activity_finish
      } = payload
      try {
        const result = await Api.user_upd(
          {cid, uid},
          {
            fullname,
            gids,
            rid,
            email,
            password,
            activity_start,
            activity_finish
          }
        )
        if (result.status === 200) {
          return Promise.resolve('User updated success')
        } else {
          throw Error(`Error update user, status - ${result.status}`)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    async USER_DEL({commit, getters}, uid) {
      const cid = getters.me.profile.company_id
      //const {uid} = getters.user_selected
      try {
        const result = await Api.user_del({cid, uid})
        if (result.status === 204) {
          return Promise.resolve('User deleted success')
        } else {
          throw Error(`Error delete user, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(`Error delete user: ${err}`)
      }
    }
  },
  mutations: {
    SET_USERS(state, user_list) {
      state.users.list = [...user_list]
    },
    SET_USERS_IS_LOADING(state, isload) {
      state.users.isListLoading = isload
    },
    SET_ACTIVE_USER(state, user) {
      state.users.isListLoading = true
      state.users.selected = user
      state.users.isListLoading = false
    },
    SET_IMPORT_STATUS(state, status) {
      state.usersImportStatus = status
    }
  },
  getters: {
    users_list: (state) => state.users.list,
    users_is_loading: (state) => state.users.isListLoading,
    user_selected: (state) => state.users.selected
  }
}
