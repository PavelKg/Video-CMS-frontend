export default {
  state: {
    categories: {
      groups: {
        name: {
          required: true,
          minLength: 3,
          maxLength: 20,
          isUnique: 'nameUniqError'
        },
        parent: {required: false}
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
        gids: {},
        rid: {
          required: true
        },
        email: {
          required: true,
          email: true,
          isUnique: 'emailUniqError'
        },
        password: {
          required: (function() {
            const isEdit = function(props) {
              return props['oper'] === 'add'
            }
            return {field: '$props', fn: isEdit}
          })(),
          minLength: 8
        },
        confPassword: {
          minLength: 8,
          sameAsPassword: 'password'
        }
      },
      videos: {
        video_title: {
          required: true,
          minLength: 5,
          regex: /^[\wа-яА-Яa-zA-Z0-9_\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]*$/
        }
      },
      messages: {
        subject: {required: true, minLength: 3, maxLength: 50},
        receiver: {
          required: true
        },
        text: {required: true, minLength: 1, maxLength: 150}
      },
      comments: {comment_text: {required: true, minLength: 1, maxLength: 1500}},
      search: {}
    }
  }
}
