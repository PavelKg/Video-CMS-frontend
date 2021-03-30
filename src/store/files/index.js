import Api from '@/api'
import {get_uuid} from '../helpers'

export default {
  state: {
    list: [],
    public: 'all',
    period: ['1900-01-01', '2100-12-31'],
    isLoading: false,
    isDeleting: false,
    selected: [],
    // active_video_uuid: '',
    // active_video_page: 1,
    filesForUpload: {
      list: []
    }
  },
  actions: {
    async UPLOAD_FILES({state, commit, getters}) {
      const cid = getters.me.profile.company_id
      const files = state.filesForUpload.list
        .filter((file) => !Boolean(file.uploaded) && !Boolean(file.isUploading))
        .map((item) => {
          const {name, size, type} = item.file
          const {uuid} = item
          return {name, size, type, uuid}
        })
      try {
        files.forEach((file) => {
          commit('SET_IS_UPLOADING_FILE', file.uuid)
          Api.getGcsSignedUrl(cid, file, 'files').then((res) => {
            const {url, uuid} = res.data
            const {file: sFile, progress} = state.filesForUpload.list.find(
              (item) => item.uuid === uuid
            )
            Api.upload_files(url, sFile, progress).then((ures) => {
              Api.uploaded_update_status(
                {cid, uuid, value: 'uploaded'},
                'files'
              )
              const f_ind = state.filesForUpload.list.findIndex((file) => {
                return file.uuid === uuid
              })
              if (f_ind > -1) {
                state.filesForUpload.list.splice(f_ind, 1)
              }
              // this add api to set state = uploaded
            })
          })
        })
      } catch (err) {
        console.log('upload_file_error: ', err)
      }
    },
    async LOAD_FILES({state, commit}, payload) {
      // file list for binding func
      const {cid, filter = ''} = payload
      commit('SET_STATUS_LOADING', true)
      let lfilter = `${filter} files.deleted_at[isNull]:,files.updated_at[gt]:'${state.period[0]}'::date,files.updated_at[lt]:'${state.period[1]}'::date`
      lfilter +=
        state.public === 'all'
          ? ''
          : `,file_public[eq]:${Boolean(state.public === 'public')}`
      let offset = 0
      let limit = 0
      try {
        const result = await Api.file_catalog({cid}, {lfilter, offset, limit})

        if (result.status === 200) {
          commit('SET_FILE_LIST', result.data)
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      } finally {
        commit('SET_STATUS_LOADING', false)
      }
    },
    async LOAD_FILE_LIST({state, commit, getters}) {
      const cid = getters.me.profile.company_id
      commit('SET_STATUS_LOADING', true)
      let filter = `files.deleted_at[isNull]:,files.updated_at[gt]:'${state.period[0]}'::date,files.updated_at[lt]:'${state.period[1]}'::date`
      filter +=
        state.public === 'all'
          ? ''
          : `,file_public[eq]:${Boolean(state.public === 'public')}`
      let offset = 0
      let limit = 0
      try {
        const result = await Api.file_catalog({cid}, {filter, offset, limit})
        if (result.status === 200) {
          commit('SET_FILE_LIST', result.data)
        } else {
          throw `Error load file list, status - ${result.status}`
        }
      } catch (err) {
        console.log('error=', {err})
        throw Error(err.response.data.message)
      } finally {
        commit('SET_STATUS_LOADING', false)
      }
    },
    async LOAD_FILE_INFO_BY_UUID({getters, dispatch}, uuid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.file_info_by_uuid({cid, uuid})
        if (result.status === 200) {
          return result.data
        } else {
          throw `Error load file by uuid, status - ${result.status}`
        }
      } catch (err) {
        switch (err.response.data.statusCode) {
          case 500:
            throw Error(err.response.data.message)
            break
          default:
            throw Error(err.response.data.message)
            break
        }
      }
    },
    async LOAD_FILE_THUMBNAIL({getters}, uuid) {
      const cid = getters.me.profile.company_id
      try {
        const result = {status: 200, data: ''} //await Api.video_thumbnail_by_uuid({cid, uuid})
        if (result.status === 200) {
          return result.data
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      }
    },
    async UPDATE_FILE_INFO({state, commit, getters}, file_info) {
      const cid = getters.me.profile.company_id
      const {
        file_uuid: uuid,
        file_thumbnail,
        file_title,
        file_tag,
        file_description,
        file_groups,
        file_series
      } = file_info
      const info_data = Object.assign(
        {},
        file_title && {file_title},
        file_tag && {file_tag},
        file_description && {file_description},
        file_groups && {file_groups},
        file_series && {file_series}
      )
      info_data.file_thumbnail = file_thumbnail
      try {
        const result = await Api.file_update_info({cid, uuid, info_data})
        if (result.status === 200) {
          return result.data
        } else {
          throw `Error update file info, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data.message
      } finally {
      }
    },
    async UPDATE_FILE_PUBLIC_STATUS({getters, commit}, {uuid, value}) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.file_update_public_status({cid, uuid, value})
        if (result.status === 200) {
          commit('SET_FILE_PUBLIC_STATUS', {uuid, value: value === 'public'})
        } else {
          throw `Error update file public status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data.message
      }
    },
    async DELETE_FILE({state, getters}) {
      const cid = getters.me.profile.company_id
      state.isDeleting = true
      try {
        await Promise.all(
          state.selected.map(async (uuid) => {
            return await Api.file_delete({cid, uuid})
          })
        )
      } catch (error) {
      } finally {
        state.isDeleting = false
      }
    },
    async FILE_SERIES_MULTI_OPER({dispatch}, payload) {
      const {uuid_list = [], sid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      await Promise.all(
        uuid_list.map(async (uuid) => {
          await dispatch(`FILE_SERIES_OPER`, {uuid, sid, oper: lOper})
        })
      )
      return Promise.resolve('File series operate finished')
    },
    async FILE_SERIES_OPER({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {uuid, sid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      try {
        const result = await Api[`file_series_${lOper}`]({cid, uuid, sid})
        if (result.status === 204) {
          return Promise.resolve('File series updated success')
        } else {
          throw `Error update file series, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data.message.replace(/^Error:\s/gi, '')
      }
    },
    async FILE_GROUPS_MULTI_OPER({dispatch}, payload) {
      const {uuid_list = [], gid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      const resOper = Promise.all(
        uuid_list.map((uuid) => {
          dispatch(`FILE_GROUPS_OPER`, {uuid, gid, oper: lOper})
        })
      )
      resOper.then(() => {
        return Promise.resolve('File groups operation finished')
      })
    },
    async FILE_GROUPS_OPER({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {uuid, gid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      try {
        const result = await Api[`file_group_${lOper}`]({cid, uuid, gid})
        if (result.status === 204) {
          return Promise.resolve('FILE groups updated success')
        } else {
          throw `Error update file groups, status - ${result.status}`
        }
      } catch (err) {
        throw err.response.data.message.replace(/^Error:\s/gi, '')
      }
    },
    async ADD_FILE_PLAYER_EVENT({getters}, {uuid, event_data}) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.file_add_player_event({
          cid,
          uuid,
          event_data
        })
        if (result.status !== 204) {
          throw Error(`Error add file player event - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      }
    },
    async FILE_BIND_SERIES({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {sid} = payload
      try {
        const result = await Api.file_bind_series({cid, sid})
        if (result.status === 200) {
          return result.data
        } else {
          throw `Error get file binding series list: ${result.status}`
        }
      } catch (err) {
        throw err.response.data.message.replace(/^Error:\s/gi, '')
      }
    },
    async FILE_BIND_GROUP({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {gid} = payload
      try {
        const result = await Api.file_bind_group({cid, gid})
        if (result.status === 200) {
          return result.data
        } else {
          throw `Error get file binding group list: ${result.status}`
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    }
  },
  mutations: {
    SET_FILE_LIST(state, list) {
      state.list = [...list]
    },
    // SET_ACTIVE_VIDEO(state, uuid) {
    //   state.active_video_uuid = uuid
    // },
    // SET_ACTIVE_VIDEO_PAGE(state, num) {
    //   state.active_video_page = num
    // },
    SET_FILE_PERIOD(state, _period) {
      const {month_from, month_to, year_from, year_to} = _period
      const from = new Date(year_from, month_from - 1, 2)
        .toISOString()
        .slice(0, 10)
      const to = new Date(year_to, month_to, 2).toISOString().slice(0, 10)
      state.period = [from, to]
    },
    SET_FILE_PUBLIC(state, _public) {
      state.public = _public
    },
    ADD_UPLOAD_FILE(state, files) {
      // need add check for existing file name
      //const files = [..._files]
      files.forEach(function(file) {
        state.filesForUpload.list.push({
          file: file,
          uuid: get_uuid(),
          uploaded: false,
          isUploading: false,
          progress: {percent: 0}
        })
      })
      //state.filesForUpload.list = [...state.filesForUpload.list, ...files]
    },
    SET_UPLOADED_FILE(state, uuid) {
      const uploaded_index = state.filesForUpload.list.findIndex(function(
        item
      ) {
        if (item.uuid === uuid) {
          return true
        }
      })
      if (~uploaded_index) {
        state.filesForUpload.list[uploaded_index].uploaded = true
        state.filesForUpload.list[uploaded_index].isUploading = false
      }
    },
    SET_IS_UPLOADING_FILE(state, uuid) {
      const uploading_index = state.filesForUpload.list.findIndex(function(
        item
      ) {
        if (item.uuid === uuid) {
          return true
        }
      })
      if (~uploading_index) {
        state.filesForUpload.list[uploading_index].isUploading = true
        state.filesForUpload.list[uploading_index].progress.percent = 0
      }
    },
    DEL_UPLOAD_FILE(state, file_name) {
      const del_index = state.filesForUpload.list.findIndex(function(item) {
        if (item.file.name === file_name) {
          return true
        }
      })
      if (~del_index) {
        state.filesForUpload.list.splice(del_index, 1)
      }
    },
    // CLEAR_UPLOAD_FILES(state) {
    //   // need add check for existing file name
    //   for (let i = 0; i < state.filesForUpload.list.length; i++) {
    //     if (
    //       !state.filesForUpload.list[i].uploaded &&
    //       !state.filesForUpload.list[i].isUploading
    //     ) {
    //       state.filesForUpload.list.splice(i, 1)
    //       i--
    //     }
    //   }
    // },
    SET_STATUS_LOADING(state, status) {
      state.isLoading = status
    },
    SET_FILE_SELECTED(state, uuid) {
      if (state.selected.indexOf(uuid) === -1) {
        state.selected.push(uuid)
      }
    },
    SET_FILE_PUBLIC_STATUS(state, {uuid, value}) {
      const ind = state.list.findIndex(function(item) {
        return item.file_uuid === uuid
      })
      if (ind > -1) {
        state.list[ind].file_public = value
      }
    },
    UNSET_FILE_SELECTED(state, uuid) {
      const ind = state.selected.indexOf(uuid)
      if (ind > -1) {
        state.selected.splice(ind, 1)
      }
    },
    CLEAR_FILE_SELECTED(state) {
      state.selected = []
    }
  },
  getters: {
    file_list: (state) => state.list.filter((file) => !Boolean(file.deleted_at))
    // isFilesListLoading: (state) => state.isListLoading,
    // isFilesDeleting: (state) => state.isDeleting,
    // files_selected: (state) => state.selected,
    // //active_video_uuid: (state) => state.active_video_uuid,
    // //active_video_page: (state) => state.active_video_page,
    // files_for_upload: (state) => state.filesForUpload.list
  }
}
