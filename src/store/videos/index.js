import Api from '@/api'
const count = 8
const uuid = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )

export default {
  state: {
    videos: [],
    active_video: {},
    filesForUpload: {
      list: [],
      isUploading: false
    }
  },
  actions: {
    async UPLOAD_VIDEO_FILES({state, commit, rootGetters}) {
      state.filesForUpload.isUploading = true
      console.log('state.filesForUpload=', state.filesForUpload)

      const files = state.filesForUpload.list.map(item => {
        const {name, size, type} = item.file
        const {uuid} = item
        return {name, size, type, uuid}
      })

      try {
        const res_url_list = await Promise.all(
          files.map(async file => {
            //file.name = file.uuid
            console.log('file=', file)            
            return await Api.getGcsSignedUrl(file)
          })
        )
        // const resp_url = await Api.getGcsSignedUrl(files)
        const url_list = res_url_list.map(item => item.data)

        // const xhr = new XMLHttpRequest()
        // xhr.open('PUT', url, true)

        // xhr.onload = function() {
        //   if (xhr.status === 200) {
        //     alert('Yay!')
        //   } else {
        //     alert('failure')
        //   }
        // }

        // xhr.onerror = function() {
        //   alert('failure')
        // }

        // xhr.setRequestHeader('Content-Type', 'image/jpeg')
        // xhr.send(formdata)
        console.log('url_list=', url_list)

        const result = await Promise.all(
          url_list.map(async (url_item, index) => {
            const file_idx = state.filesForUpload.list.findIndex(function(
              item
            ) {
              return item.uuid === url_item.name
            })

            if (!~file_idx) {
              throw Error('Upload file not found')
            }
            const {progress_handler, file} = state.filesForUpload.list[file_idx]
            return await Api.upload_files(url_item.url, file, progress_handler)
          })
        )

        console.log('result=', result)
        //const resp = await Api.upload_files(url, formdata)
        const code = result.status
        if (code === 200) {
          state.filesForUpload.isUploading = false
        }
      } catch (err) {
        console.log('upload_file_error: ', err)
        state.filesForUpload.isUploading = false
      }
    },
    async LOAD_VIDEO_LIST({state, commit}) {
      const loadList = []
      for (let i = 0; i < count; i += 1) {
        const video_item = {
          tag: `tag-${i}`,
          title: `Video-${i}-file`,
          description: `This is - ${i + 1} moves from ${count}`,
          last_mod: new Date(2018, Math.random() * 12, Math.random() * 30),
          author_id: i * Math.random(1000),
          url: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'
        }
        loadList.push(video_item)
      }
      commit('SET_VIDEO_LIST', loadList)
    }
  },
  mutations: {
    SET_VIDEO_LIST(state, _list) {
      state.videos = [..._list]
    },
    SET_ACTIVE_VIDEO(state, item) {
      state.active_video = item
    },
    ADD_UPLOAD_FILE(state, _files) {
      // need add check for existing file name
      const files = [..._files]
      files.forEach(function(file) {
        state.filesForUpload.list.push({file: file, uuid: uuid()})
      })
      //state.filesForUpload.list = [...state.filesForUpload.list, ...files]
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
    video_list: state => state.videos,
    active_video: state => state.active_video,
    files_for_upload: state => state.filesForUpload.list.map(item => item.file),
    storeFilesIsUploading: state => state.filesForUpload.isUploading
  }
}
