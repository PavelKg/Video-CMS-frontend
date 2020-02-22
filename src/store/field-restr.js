export default {
  state: {
    categories: {
      groups: {
        name: {min_length: 3, max_length: 20}
      },
      roles: {
        name: {min_length: 3, max_length: 20},
        rid: {min_length: 3, max_length: 20}
      },
      series: {
        name: {min_length: 3, max_length: 20}
      },
      users: {
        uid: {min_length: 5, max_length: 10},
        fullname: {min_length: 3, max_length: 50}
      },
      videos: {},
      messages: {},
      comments: {},
      search: {}
    }
  }
}
