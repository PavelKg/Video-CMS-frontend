// import Api from '@/api'
const count = 20

export default {
  state: {
    messages: {
      list: [],
      isListLoading: false,
      selected: null
    },
    columns_name: {
      outbox: ['check', 'subject', 'to', 'sent'],
      inbox: ['check', 'subject', 'from', 'received']
    }
  },
  actions: {
    LOAD_MESSAGES({state}, type) {
      state.messages.list = []
      const user_type = type.toLowerCase() === 'inbox' ? 'Sender' : 'admin'
      for (let i = 0; i < count; i += 1) {
        const message_item = {
          mid: i,
          date: new Date(2019, Math.random() * 12, Math.random() * 30),
          user: user_type,
          subject: `Please check new video`,
          text: `Javascript Array Find Example | 
          Array.prototype.find() Tutorial is today’s leading topic. 
          The Javascript Array find() method returns a value of the first 
          item in an array that satisfies a provided testing function. 
          Otherwise undefined will be returned.`,
          isSystem: false
        }
        state.messages.list.push(message_item)
      }
    }
  },
  mutations: {
    SET_ACTIVE_MESSAGE(state, item) {
      state.messages.selected = item
    }
  },
  getters: {
    message_list: state => state.messages.list,
    active_message: state => state.messages.selected,
    message_box_column: state => tab => state.columns_name[tab],
    isShowModalMessageInfo: state => state.messages.isShowModalMessageInfo
  }
}
