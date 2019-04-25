import Api from '@/api'
const count = 8

export default {
  state: {
    videos: [],
    active_video: {},
    isUploading: false
  },
  actions: {
    async UPLOAD_VIDEO_FILES({state, commit, rootGetters}, formdata) {
      this.isUploading = true
      try {
        const {company_id, uid} = rootGetters.me.profile
        const resp = await Api.upload_files({cid:company_id, uid}, formdata)
        const code = resp.status
        if (code === 200 ) {
          this.isUploading = false
        }
      } catch (err) {
        this.isUploading = false
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
    },    
  },
  mutations: {
    SET_VIDEO_LIST(state, _list) {
      state.videos = [..._list]
    },
    SET_ACTIVE_VIDEO(state, item) {
      state.active_video = item
    }
  },
  getters: {
    video_list: state => state.videos,
    active_video: state => state.active_video
  }
}
