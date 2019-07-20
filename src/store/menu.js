import router from '@/router'

const findPropByName = function(obj, path) {
  const paths = path.split('.')
  let current = obj
  for (let i = 0; i < paths.length; i += 1) {
    if (current[paths[i]] === undefined) {
      return undefined
    } else {
      current = current[paths[i]]
    }
  }
  return current
}

const menuStructure = {
  super: {
    root: {
      isOpen: true,
      activeItem: 'root.subItems.home',
      caption: '',
      visible: true,
      subItems: {
        home: {
          caption: 'menu.home',
          visible: true
        },
        company: {
          caption: 'menu.company',
          visible: true,
          subItems: {
            add: {
              type: 'company.add',
              caption: 'menu.comp_add'
            },
            edit: {
              type: 'company.edit',
              caption: 'menu.comp_edit'
            },
            info: {
              type: 'company.info',
              caption: 'menu.comp_info'
            },
            videos: {
              type: 'company.videos',
              caption: 'menu.comp_videos'
            }
          }
        },
        videos: {
          caption: 'menu.video',
          type: 'videos.list',
          visible: true,
          subItems: {
            player: {
              type: 'videos.video_player',
              caption: 'menu.video_player'
            }
          }
        },
        messages: {
          caption: 'menu.messages',
          type: 'messages.list',
          visible: true
        },
        roles: {
          caption: 'menu.role',
          type: 'role.settings',
          visible: true
        }
      }
    }
  },
  // admin: {
  //   root: {
  //     isOpen: true,
  //     activeItem: 'root.subItems.home',
  //     caption: '',
  //     visible: true,
  //     subItems: {
  //       home: {
  //         caption: 'menu.home',
  //         visible: true
  //       },
  //       users: {
  //         caption: 'menu.users',
  //         visible: true,
  //         subItems: {
  //           add: {
  //             type: 'users.user_add',
  //             caption: 'menu.user_add'
  //           },
  //           edit: {
  //             type: 'users.user_add',
  //             caption: 'menu.user_edit'
  //           },
  //           info: {
  //             type: 'users.user_info',
  //             caption: 'menu.user_info'
  //           }
  //         }
  //       },
  //       videos: {
  //         caption: 'menu.videos',
  //         type: 'videos.list',
  //         subItems: {
  //           player: {
  //             type: 'videos.video_player',
  //             caption: 'menu.video_player'
  //           },
  //           upload: {
  //             type: 'videos.video_upload',
  //             caption: 'menu.video_upload'
  //           },
  //           edit: {
  //             type: 'videos.video_subtitles',
  //             caption: 'menu.video_subtitles'
  //           }
  //         }
  //       },
  //       groups: {
  //         caption: 'menu.groups',
  //         type: 'group.list',
  //         visible: true,
  //         subItems: {
  //           edit: {
  //             type: 'groups.group_edit',
  //             caption: 'menu.group_edit'
  //           },
  //           add: {
  //             type: 'groups.group_add',
  //             caption: 'menu.group_add'
  //           }
  //         }
  //       },
  //       messages: {
  //         caption: 'menu.messages',
  //         type: 'messages.list',
  //         visible: true
  //       },
  //       screen: {
  //         caption: 'menu.screen',
  //         type: 'screen.settings',
  //         visible: true
  //       },
  //       roles: {
  //         caption: 'menu.roles',
  //         type: 'roles.list',
  //         visible: true,
  //         subItems: {
  //           edit: {
  //             type: 'roles.role_edit',
  //             caption: 'menu.role_edit'
  //           },
  //           add: {
  //             type: 'roles.role_add',
  //             caption: 'menu.role_add'
  //           }
  //         }
  //       }
  //     }
  //   }
  // },

  admin: {
    home: {
      caption: 'menu.home',
      visible: true
    },
    users: {
      caption: 'menu.users',
      visible: true,
      subItems: {
        add: {
          type: 'users.user_add',
          caption: 'menu.user_add'
        },
        edit: {
          type: 'users.user_add',
          caption: 'menu.user_edit'
        },
        info: {
          type: 'users.user_info',
          caption: 'menu.user_info'
        }
      }
    },
    videos: {
      caption: 'menu.videos',
      type: 'videos.list',
      subItems: {
        player: {
          type: 'videos.video_player',
          caption: 'menu.video_player'
        },
        upload: {
          type: 'videos.video_upload',
          caption: 'menu.video_upload'
        },
        edit: {
          type: 'videos.video_subtitles',
          caption: 'menu.video_subtitles'
        }
      }
    },
    groups: {
      caption: 'menu.groups',
      type: 'group.list',
      visible: true,
      subItems: {
        edit: {
          type: 'groups.group_edit',
          caption: 'menu.group_edit'
        },
        add: {
          type: 'groups.group_add',
          caption: 'menu.group_add'
        }
      }
    },
    messages: {
      caption: 'menu.messages',
      type: 'messages.list',
      visible: true
    },
    screen: {
      caption: 'menu.screen',
      type: 'screen.settings',
      visible: true
    },
    roles: {
      caption: 'menu.roles',
      type: 'roles.list',
      visible: true,
      subItems: {
        edit: {
          type: 'roles.role_edit',
          caption: 'menu.role_edit'
        },
        add: {
          type: 'roles.role_add',
          caption: 'menu.role_add'
        }
      }
    }
  },

  user: {
    root: {
      isOpen: true,
      activeItem: 'root.subItems.home',
      caption: '',
      visible: true,
      subItems: {
        home: {
          caption: 'menu.home',
          visible: true
        },
        messages: {
          caption: 'menu.messages',
          type: 'messages.list',
          visible: true
        },
        videos: {
          caption: 'menu.videos',
          type: 'videos.list',
          subItems: {
            caption: 'videos.messages',
            type: 'videos.list',
            player: {
              type: 'videos.video_player',
              caption: 'menu.video_player'
            }
          }
        }
      }
    }
  }
}

export default {
  state: {
    visible: false,
    menu: {
      root: {
        activeItem: false
      }
    }
  },
  actions: {
    LOAD_MENU_STATE: ({commit}) => {
      if (localStorage.getItem('vcms-activ-menu')) {
        try {
          const act_item = JSON.parse(localStorage.getItem('vcms-activ-menu'))
          const _item = act_item ? act_item : 'root.subItems.home'

          commit('ITEM_STATE', _item)
        } catch (e) {
          localStorage.removeItem('vcms-activ-menu')
        }
      }
    },
    CLEAR_MENU_STATE: () => localStorage.removeItem('vcms-activ-menu'),
    SAVE_MENU_STATE: ({state}) => {
      localStorage.setItem(
        'vcms-activ-menu',
        JSON.stringify(state.menu.root.activeItem)
      )
    },
    LOAD_USER_MENU: ({commit, dispatch}, userMenuType) => {
      if (userMenuType) {
        commit('SET_USER_MENU', menuStructure[userMenuType])
      }
      dispatch('LOAD_MENU_STATE')
    }
  },
  mutations: {
    SET_USER_MENU: (state, userMenu) => {
      state.menu = userMenu
    },
    SECTION_STATE: (state, section) => {
      let sec = findPropByName(state.menu, section)
      if (sec.isSection) {
        sec.isOpen = !sec.isOpen
      }
    },
    ITEM_STATE: (state, item) => {
      state.menu.root.activeItem = item
      console.log('router push - ', item)
    },
    MENU_HIDE: (state) => {
      state.visible = false
    },
    MENU_SHOW: (state) => {
      state.visible = true
    },
    MENU_TOGGLE: (state) => {
      state.visible = Boolean(!state.visible)
    }
  },
  getters: {
    userMenu: (state) => state.menu,
    userMenuVisible: (state) => Boolean(state.visible),
    userMenuActiveItem: (state) => state.menu.root.activeItem
  }
}
