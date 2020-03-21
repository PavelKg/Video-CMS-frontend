export default {
  state: {
    categories: {
      groups: {
        name: {
          required: true,
          minLength: 3,
          maxLength: 20,
          isUnique: 'nameUniqError'
        }
      },
      roles: {
        name: {required: true, minLength: 3, maxLength: 20},
        rid: {
          required: true,
          minLength: 3,
          maxLength: 20,
          isUnique: 'ridUniqError'
        }
      },
      series: {
        name: {
          required: true,
          minLength: 3,
          maxLength: 20,
          isUnique: 'nameUniqError'
        }
      },
      users: {
        uid: {
          required: true,
          minLength: 5,
          maxLength: 10,
          isUnique: 'uidUniqError'
        },
        fullname: {required: true, minLength: 3, maxLength: 50},
        //gids: {},
        rid: {
          required: true
        },
        email: {
          required: true,
          email: true,
          isUnique: 'emailUniqError'
        },
         password: {
           //requered: {'oper': 'add'},
           minLength: 8
         },
         confPassword: {
          minLength: 8
        //   //sameAsPassword: 'password'
         }
      },
      videos: {
        video_title: {
          required: true,
          min_length: 5,
          regex_value: /^[\wа-яА-Яa-zA-Z0-9_\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]*$/
        }
      },
      messages: {subject: {min_length: 3, max_length: 50}},
      comments: {},
      search: {}
    }
  }
}
