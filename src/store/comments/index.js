// import Api from '@/api'
const count = 10

export default {
  state: {
    comments: [],
    active_comment: null
  },
  actions: {},
  mutations: {
    GET_COMMENTS(state) {
      for (let i = 0; i < count; i += 1) {
        const comment_item = {
          id: i,
          date: new Date(2018, Math.random()*12, Math.random()*30),
          author: String('0000' + i).slice(-4),
          message: `Thanks for this mix. its cool when you just want to 
          listen to a play list on you tube and not have the music videos playing. Cheers :)`
        }
        state.comments.push(comment_item)
      }
    },
    SET_ACTIVE_COMMENT(state, id) {
      state.active_comment = id
    }

  },
  getters: {
    comment_list: state => state.comments,
    active_comment: state => state.comments[active_comment],
    active_comment_id: state => state.active_comment
  }
}
