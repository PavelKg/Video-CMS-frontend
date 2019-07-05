import Api from '@/api'

export default {
  state: {
    comments: {
      list: [],
      active: null
    }
  },
  actions: {
    async LOAD_COMMENTS({state, getters, commit}, uuid) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.comments({cid, uuid}, {})
        if (result.status === 200) {
          commit('SET_VIDEO_COMMENTS', result.data)
        } else {
          throw Error(`Error load comments - ${result.status}`)
        }
      } catch (err) {
        console.log('err=', err)
        throw Error(err.response.data.message)
      }
    },
    async ADD_COMMENT({state, getters, commit, dispatch}, {uuid, text}) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.add_comment({cid, uuid, comment_text: text})
        if (result.status === 201) {
          const comid = result.headers['location'].match(/\/(\d+)$/i)[1]
          const {data: commentInfo} = await Api.get_comment_info({
            cid,
            uuid,
            comid
          })
          commit('ADD_VIDEO_COMMENTS', commentInfo)
        } else {
          throw Error(`Error load comments - ${result.status}`)
        }
      } catch (err) {
        console.log('err=', err)
        throw Error(err.response.data.message)
      }
    },
    async CHANGE_COMMENT_VISIBLE(
      {state, getters, commit},
      {uuid, comid, value}
    ) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.comment_visible({cid, uuid, comid, value})
        if (result.status === 200) {
          commit('SET_COMMENT_VISIBLE', {uuid, comid, value})
        } else {
          throw Error(`Error update comments visible- ${result.status}`)
        }
      } catch (err) {
        console.log('err=', err)
        throw Error(err.response.data.message)
      }
    },
    async DELETE_COMMENT({state, getters, commit}, {uuid, comid}) {
      const cid = getters.me.profile.company_id
      try {
        const result = await Api.del_comment({cid, uuid, comid})
        if (result.status === 204) {
          const {data: commentInfo} = await Api.get_comment_info({
            cid,
            uuid,
            comid
          })
          commit('DEL_VIDEO_COMMENT', commentInfo)
        } else {
          throw Error(`Error del comments - ${result.status}`)
        }
      } catch (err) {
        console.log('err=', err)
        throw Error(err.response.data.message)
      }
    }
  },
  mutations: {
    SET_VIDEO_COMMENTS(state, list) {
      state.comments.list = [...list]
    },
    SET_ACTIVE_COMMENT(state, id) {
      state.active_comment = id
    },
    ADD_VIDEO_COMMENTS(state, comment) {
      state.comments.list.push(comment)
    },
    SET_COMMENT_VISIBLE(state, payload) {
      const {uuid, comid, value} = payload
      const fIndex = state.comments.list.findIndex(item => {
        return item.comment_video_uuid === uuid && item.comment_id === comid
      })
      if (fIndex > -1) {
        state.comments.list[fIndex].comment_visible = value
      }
    },
    DEL_VIDEO_COMMENT(state, commentInfo){
      const {comment_video_uuid, comment_id, deleted_at} = commentInfo
      const fIndex = state.comments.list.findIndex(item => {
        return item.comment_video_uuid === comment_video_uuid && item.comment_id === comment_id
      })
      if (fIndex > -1) {
        state.comments.list[fIndex].deleted_at = deleted_at
      }      
    }
  },
  getters: {
    comment_list: state =>
      state.comments.list.sort(function(a, b) {
        return new Date(b.created_at) - new Date(a.created_at)
      }),
    active_comment: state => state.comments.list[state.comment.active],
    active_comment_id: state => state.comment.active
  }
}
