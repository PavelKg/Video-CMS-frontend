// import Api from '@/api'
const count = 20

export default {
  state: {
    messages: [],
    columns_name: {
      outbox: ['Chech', 'Subject', 'To', 'Send'],
      inbox: ['Chech', 'Subject', 'From', 'Recived']
    },
    active_message_id: null
  },
  actions: {},
  mutations: {
    GET_MESSAGES(state, type) {
      state.messages = []
      const user_type = type.toLowerCase() === 'inbox' ? 'Sender' : 'admin'
      for (let i = 0; i < count; i += 1) {
        const message_item = {
          id: i,
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
        state.messages.push(message_item)
      }
    },
    SET_ACTIVE_MESSAGE(state, id) {
      state.active_message_id = id
    }
  },
  getters: {
    message_list: state => state.messages,
    active_message: state =>
      state.messages.find(item =>
        item.id === state.active_message_id ? true : false
      ),
    active_message_id: state => state.active_message_id,
    message_box_column: state => tab => state.columns_name[tab]
  }
}
