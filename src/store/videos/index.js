// import Api from '@/api'
const count = 30

export default {
  state: {
    videos: [],
    active_video: {}
  },
  actions: {},
  mutations: {
    CREATE_VIDEO_LIST(state) {
      for (let i = 0; i < count; i += 1) {
        const video_item = {
          tag: `tag-${i}`,
          title: `Video-${i}-file`,
          description: `This is - ${i+1} moves from ${count}`,
          last_mod: new Date(2018, Math.random()*12, Math.random()*30),
          author_id: i*Math.random(1000),
          url: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'
        }
        state.videos.push(video_item)
      }
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
