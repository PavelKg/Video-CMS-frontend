import Api from '@/api'
import {get_uuid} from '../helpers'
// const uuid = () =>
//   ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//     (
//       c ^
//       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//     ).toString(16)
//   )

export default {
  state: {
    list: [],
    public: 'all',
    period: ['1900-01-01', '2100-12-31'],
    isInfoUpdating: false,
    isListLoading: false,
    isDeleting: false,
    selected: [],
    active_video_uuid: '',
    active_video_page: 1,
    filesForUpload: {
      list: []
    }
  },
  actions: {
    // GET_ACTIVE_VIDEO_UUID: ({commit}) => {
    //   if (localStorage.getItem('vcms-activ-video-uuid')) {
    //     try {
    //       const act_item = JSON.parse(
    //         localStorage.getItem('vcms-activ-video-uuid')
    //       )
    //       const _item = act_item ? act_item : ''

    //       commit('SET_ACTIVE_VIDEO', _item)
    //     } catch (e) {
    //       localStorage.removeItem('vcms-activ-video-uuid')
    //     }
    //   }
    // },
    // CLEAR_ACTIVE_VIDEO_UUID: () =>
    //   localStorage.removeItem('vcms-activ-video-uuid'),
    // SAVE_ACTIVE_VIDEO_UUID: ({state}) => {
    //   localStorage.setItem(
    //     'vcms-activ-video-uuid',
    //     JSON.stringify(state.active_video_uuid)
    //   )
    // },
    // GET_ACTIVE_VIDEO_PAGE: ({commit}) => {
    //   if (localStorage.getItem('vcms-activ-video-page')) {
    //     try {
    //       const act_item = JSON.parse(
    //         localStorage.getItem('vcms-activ-video-page')
    //       )
    //       const _item = act_item ? act_item : 1
    //       return _item
    //       //commit('SET_ACTIVE_VIDEO_PAGE', _item)
    //     } catch (e) {
    //       localStorage.removeItem('vcms-activ-video-page')
    //     }
    //   }
    // },
    // CLEAR_ACTIVE_VIDEO_PAGE: () =>
    //   localStorage.removeItem('vcms-activ-video-page'),
    // SAVE_ACTIVE_VIDEO_PAGE: ({state}, num) => {
    //   localStorage.setItem('vcms-activ-video-page', JSON.stringify(num))
    // },

    async UPLOAD_VIDEO_FILES({state, commit, getters}) {
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
          Api.getGcsSignedUrl(cid, file).then((res) => {
            const {url, uuid} = res.data
            const {file: sFile, progress} = state.filesForUpload.list.find(
              (item) => item.uuid === uuid
            )

            Api.upload_files(url, sFile, progress).then((ures) => {
              Api.video_update_status({cid, uuid, value: 'uploaded'})
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

    async LOAD_VIDEOS({state, commit}, payload) {
      // video list for binding func
      const {cid, filter = ''} = payload
      commit('SET_STATUS_VIDEOS_LOADING', true)
      let lfilter = `${filter} videos.deleted_at[isNull]:,videos.updated_at[gt]:'${state.period[0]}'::date,videos.updated_at[lt]:'${state.period[1]}'::date`
      lfilter +=
        state.public === 'all'
          ? ''
          : `,video_public[eq]:${Boolean(state.public === 'public')}`

      let offset = 0
      let limit = 0

      try {
        const result = await Api.videos_catalog({cid}, {lfilter, offset, limit})
        if (result.status === 200) {
          commit('SET_VIDEO_LIST', result.data)
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      } finally {
        commit('SET_STATUS_VIDEOS_LOADING', false)
      }
    },

    async LOAD_VIDEO_LIST({state, commit, getters}) {
      const cid = getters.me.profile.company_id
      commit('SET_STATUS_VIDEOS_LOADING', true)
      let filter = `videos.deleted_at[isNull]:,videos.updated_at[gt]:'${state.period[0]}'::date,videos.updated_at[lt]:'${state.period[1]}'::date`
      filter +=
        state.public === 'all'
          ? ''
          : `,video_public[eq]:${Boolean(state.public === 'public')}`

      let offset = 0
      let limit = 0

      try {
        const result = await Api.videos_catalog({cid}, {filter, offset, limit})
        if (result.status === 200) {
          commit('SET_VIDEO_LIST', result.data)
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      } finally {
        commit('SET_STATUS_VIDEOS_LOADING', false)
      }
    },

    // async LOAD_VIDEOS_BY_SERIES({state, commit, getters}, params) {
    //   const {cid, filter} = params
    //   commit('SET_STATUS_VIDEOS_LOADING', true)
    //   let offset = 0
    //   let limit = 0

    //   try {
    //     const result = await Api.videos_catalog({cid}, {filter, offset, limit})
    //     if (result.status === 200) {
    //       commit('SET_VIDEO_LIST', result.data)
    //     } else {
    //       throw Error(`Error load video list, status - ${result.status}`)
    //     }
    //   } catch (err) {
    //     throw Error(err.response.data.message)
    //   } finally {
    //     commit('SET_STATUS_VIDEOS_LOADING', false)
    //   }
    // },

    async LOAD_VIDEO_INFO_BY_UUID({getters, dispatch}, uuid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.video_info_by_uuid({cid, uuid})
        if (result.status === 200) {
          return result.data
        } else {
          throw Error(`Error update role, status - ${result.status}`)
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
    async LOAD_VIDEO_THUMBNAIL({getters}, uuid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.video_thumbnail_by_uuid({cid, uuid})
        if (result.status === 200) {
          return result.data
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      }
    },
    async UPDATE_VIDEO_INFO({state, commit, getters}, video_info) {
      const cid = getters.me.profile.company_id
      commit('SET_STATUS_INFO_UPDATTING', true)
      const {
        video_uuid: uuid,
        video_thumbnail,
        video_title,
        video_tag,
        video_description,
        video_groups,
        video_series
      } = video_info

      const info_data = Object.assign(
        {},
        video_title && {video_title},
        video_tag && {video_tag},
        video_description && {video_description},
        video_groups && {video_groups},
        video_series && {video_series}
      )

      info_data.video_thumbnail = video_thumbnail

      try {
        const result = await Api.video_update_info({cid, uuid, info_data})
        if (result.status === 200) {
          return result.data
        } else {
          throw Error(`Error update role, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      } finally {
        commit('SET_STATUS_INFO_UPDATTING', false)
      }
    },

    async UPDATE_VIDEO_PUBLIC_STATUS({getters, commit}, {uuid, value}) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.video_update_public_status({cid, uuid, value})
        if (result.status === 200) {
          commit('SET_VIDEO_PUBLIC_STATUS', {uuid, value: value === 'public'})
        } else {
          throw Error(`Error update video public status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      }
    },

    async DELETE_VIDEO({state, getters}) {
      const cid = getters.me.profile.company_id
      state.isDeleting = true

      try {
        await Promise.all(
          state.selected.map(async (uuid) => {
            return await Api.video_delete({cid, uuid})
          })
        )
      } catch (error) {
      } finally {
        state.isDeleting = false
      }
    },

    async VIDEO_SERIES_MULTI_OPER({dispatch}, payload) {
      const {uuid_list = [], sid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      await Promise.all(
        uuid_list.map(async (uuid) => {
          await dispatch(`VIDEO_SERIES_OPER`, {uuid, sid, oper: lOper})
        })
      )
      return Promise.resolve('Video series operate finished')
    },

    async VIDEO_SERIES_OPER({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {uuid, sid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }

      try {
        const result = await Api[`video_series_${lOper}`]({cid, uuid, sid})
        if (result.status === 204) {
          return Promise.resolve('Video series updated success')
        } else {
          throw Error(`Error update video series, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    },

    async VIDEO_GROUPS_MULTI_OPER({dispatch}, payload) {
      const {uuid_list = [], gid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }
      const resOper = Promise.all(
        uuid_list.map((uuid) => {
          dispatch(`VIDEO_GROUPS_OPER`, {uuid, gid, oper: lOper})
        })
      )
      resOper.then(() => {
        return Promise.resolve('Video groups operation finished')
      })
    },

    async VIDEO_GROUPS_OPER({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {uuid, gid, oper = ''} = payload
      const lOper = oper.toLowerCase()
      if (lOper !== 'del' && lOper !== 'add') {
        throw Error(`Incorect operation type`)
      }

      try {
        const result = await Api[`video_group_${lOper}`]({cid, uuid, gid})
        if (result.status === 204) {
          return Promise.resolve('Video groups updated success')
        } else {
          throw Error(`Error update video groups, status - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    },

    async ADD_PLAYER_EVENT({getters}, {uuid, event_data}) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.video_add_player_event({
          cid,
          uuid,
          event_data
        })
        if (result.status !== 204) {
          throw Error(`Error add video player event - ${result.status}`)
        }
      } catch (err) {
        throw Error(err.response.data.message)
      }
    },

    async VIDEO_BIND_SERIES({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {sid} = payload
      try {
        const result = await Api.video_bind_series({cid, sid})
        if (result.status === 200) {
          return result.data
        } else {
          throw Error(
            `Error get video list binding series, status - ${result.status}`
          )
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    },
    async VIDEO_BIND_GROUP({commit, getters}, payload) {
      const cid = getters.me.profile.company_id
      const {gid} = payload
      try {
        const result = await Api.video_bind_group({cid, gid})
        if (result.status === 200) {
          return result.data
        } else {
          throw Error(
            `Error get video list binding group, status - ${result.status}`
          )
        }
      } catch (err) {
        throw Error(err.response.data.message.replace(/^Error:\s/gi, ''))
      }
    }
  },
  mutations: {
    SET_VIDEO_LIST(state, _list) {
      state.list = [..._list]
    },
    SET_ACTIVE_VIDEO(state, uuid) {
      state.active_video_uuid = uuid
    },
    SET_ACTIVE_VIDEO_PAGE(state, num) {
      state.active_video_page = num
    },
    SET_VIDEO_PERIOD(state, _period) {
      const {month_from, month_to, year_from, year_to} = _period
      const from = new Date(year_from, month_from - 1, 2)
        .toISOString()
        .slice(0, 10)
      const to = new Date(year_to, month_to, 1).toISOString().slice(0, 10)

      state.period = [from, to]
    },
    SET_VIDEO_PUBLIC(state, _public) {
      state.public = _public
    },
    ADD_UPLOAD_FILE(state, _files) {
      // need add check for existing file name
      const files = [..._files]
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
    CLEAR_UPLOAD_FILES(state) {
      // need add check for existing file name
      for (let i = 0; i < state.filesForUpload.list.length; i++) {
        if (
          !state.filesForUpload.list[i].uploaded &&
          !state.filesForUpload.list[i].isUploading
        ) {
          state.filesForUpload.list.splice(i, 1)
          i--
        }
      }
    },
    SET_STATUS_INFO_UPDATTING(state, status) {
      state.isInfoUpdating = status
    },
    SET_STATUS_VIDEOS_LOADING(state, status) {
      state.isListLoading = status
    },
    SET_VIDEO_SELECTED(state, uuid) {
      if (state.selected.indexOf(uuid) === -1) {
        state.selected.push(uuid)
      }
    },
    SET_VIDEO_PUBLIC_STATUS(state, {uuid, value}) {
      const ind = state.list.findIndex(function(item) {
        return item.video_uuid === uuid
      })
      if (ind > -1) {
        state.list[ind].video_public = value
      }
    },
    UNSET_VIDEO_SELECTED(state, uuid) {
      const ind = state.selected.indexOf(uuid)
      if (ind > -1) {
        state.selected.splice(ind, 1)
      }
    },
    CLEAR_VIDEO_SELECTED(state) {
      state.selected = []
    }
    // PROGRESS_UPLOAD_FILE(state, payload) {
    //   const {name, progress} = payload
    //   const upd_index = state.filesForUpload.list.findIndex(function(item) {
    //     if (item.file.name === name) {
    //       return true
    //     }
    //   })
    //   if (~upd_index) {
    //     state.filesForUpload.list[upd_index].progress = progress
    //   }
    // }
  },
  getters: {
    video_list: (state) =>
      state.list.filter((video) => !Boolean(video.deleted_at)),
    isVideosInfoUpdating: (state) => state.isInfoUpdating,
    isVideosListLoading: (state) => state.isListLoading,
    isVideosDeleting: (state) => state.isDeleting,
    videos_selected: (state) => state.selected,
    active_video_uuid: (state) => state.active_video_uuid,
    active_video_page: (state) => state.active_video_page,
    video_files_for_upload: (state) => state.filesForUpload.list
  }
}
