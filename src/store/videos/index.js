import Api from '@/api'

const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )

export default {
  state: {
    videos: {
      list: [],
      public: 'all',
      period: ['1900-01-01', '2100-12-31'],
      isInfoUpdating: false,
      isListLoading: false,
      isDeleting: false,
      selected: []
    },
    active_video_uuid: '',
    active_video_page: 1,
    filesForUpload: {
      list: []
    }
  },
  actions: {
    GET_ACTIVE_VIDEO_UUID: ({commit}) => {
      if (localStorage.getItem('vcms-activ-video-uuid')) {
        try {
          const act_item = JSON.parse(
            localStorage.getItem('vcms-activ-video-uuid')
          )
          const _item = act_item ? act_item : ''

          commit('SET_ACTIVE_VIDEO', _item)
        } catch (e) {
          localStorage.removeItem('vcms-activ-video-uuid')
        }
      }
    },
    CLEAR_ACTIVE_VIDEO_UUID: () =>
      localStorage.removeItem('vcms-activ-video-uuid'),
    SAVE_ACTIVE_VIDEO_UUID: ({state}) => {
      localStorage.setItem(
        'vcms-activ-video-uuid',
        JSON.stringify(state.active_video_uuid)
      )
    },
    GET_ACTIVE_VIDEO_PAGE: ({commit}) => {
      if (localStorage.getItem('vcms-activ-video-page')) {
        try {
          const act_item = JSON.parse(
            localStorage.getItem('vcms-activ-video-page')
          )
          const _item = act_item ? act_item : 1
          return _item
          //commit('SET_ACTIVE_VIDEO_PAGE', _item)
        } catch (e) {
          localStorage.removeItem('vcms-activ-video-page')
        }
      }
    },
    CLEAR_ACTIVE_VIDEO_PAGE: () =>
      localStorage.removeItem('vcms-activ-video-page'),
    SAVE_ACTIVE_VIDEO_PAGE: ({state}, num) => {
      localStorage.setItem(
        'vcms-activ-video-page',
        JSON.stringify(num)
      )
    },

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
            const {
              progress_handler,
              file: sFile
            } = state.filesForUpload.list.find((item) => item.uuid === uuid)
            //isUploading = true
            Api.upload_files(url, sFile, progress_handler).then((ures) => {
              console.log('ures=', ures)
              Api.video_update_status({cid, uuid, value: 'uploaded'})
              // this add api to set state = uploaded
            })
          })
        })
      } catch (err) {
        console.log('upload_file_error: ', err)
      }
    },

    async LOAD_VIDEO_LIST({state, commit, getters}) {
      const cid = getters.me.profile.company_id
      commit('SET_STATUS_VIDEOS_LOADING', true)
      let filter = `videos.deleted_at[isNull]:,videos.updated_at[gt]:'${
        state.videos.period[0]
      }'::date,videos.updated_at[lt]:'${state.videos.period[1]}'::date`
      filter +=
        state.videos.public === 'all'
          ? ''
          : `,video_public[eq]:${Boolean(state.videos.public === 'public')}`

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
            break;
          default:
              throw Error(err.response.data.message)
            break;
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
        video_description
      } = video_info

      const info_data = {
        video_thumbnail,
        video_title,
        video_tag,
        video_description
      }

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
      state.videos.isDeleting = true

      try {
        await Promise.all(
          state.videos.selected.map(async (uuid) => {
            console.log('state.videos.selected=', uuid)
            return await Api.video_delete({cid, uuid})
          })
        )
      } catch (error) {
      } finally {
        state.videos.isDeleting = false
      }
    }
  },
  mutations: {
    SET_VIDEO_LIST(state, _list) {
      state.videos.list = [..._list]
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

      state.videos.period = [from, to]
    },
    SET_VIDEO_PUBLIC(state, _public) {
      state.videos.public = _public
    },
    ADD_UPLOAD_FILE(state, _files) {
      // need add check for existing file name
      const files = [..._files]
      files.forEach(function(file) {
        state.filesForUpload.list.push({
          file: file,
          uuid: uuid(),
          uploaded: false,
          isUploading: false
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
      state.filesForUpload.list = []
    },
    SET_STATUS_INFO_UPDATTING(state, status) {
      state.videos.isInfoUpdating = status
    },
    SET_STATUS_VIDEOS_LOADING(state, status) {
      state.videos.isListLoading = status
    },
    SET_VIDEO_SELECTED(state, uuid) {
      if (state.videos.selected.indexOf(uuid) === -1) {
        state.videos.selected.push(uuid)
      }
    },
    SET_VIDEO_PUBLIC_STATUS(state, {uuid, value}) {
      const ind = state.videos.list.findIndex(function(item) {
        return item.video_uuid === uuid
      })
      if (ind > -1) {
        state.videos.list[ind].video_public = value
      }
    },
    UNSET_VIDEO_SELECTED(state, uuid) {
      const ind = state.videos.selected.indexOf(uuid)
      if (ind > -1) {
        state.videos.selected.splice(ind, 1)
      }
    },
    CLEAR_VIDEO_SELECTED(state) {
      state.videos.selected = []
    },
    PROGRESS_UPLOAD_FILE(state, payload) {
      const {name, progress_handler} = payload
      const upd_index = state.filesForUpload.list.findIndex(function(item) {
        if (item.file.name === name) {
          return true
        }
      })
      if (~upd_index) {
        state.filesForUpload.list[upd_index].progress_handler = progress_handler
      }
    }
  },
  getters: {
    video_list: (state) =>
      state.videos.list.filter((video) => !Boolean(video.deleted_at)),
    isVideosInfoUpdating: (state) => state.videos.isInfoUpdating,
    isVideosListLoading: (state) => state.videos.isListLoading,
    isVideosDeleting: (state) => state.videos.isDeleting,
    videos_selected: (state) => state.videos.selected,
    active_video_uuid: (state) => state.active_video_uuid,
    active_video_page: (state) => state.active_video_page,
    files_for_upload: (state) => state.filesForUpload.list
  }
}
