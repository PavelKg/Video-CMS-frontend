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
    isOpen: true,
    visible: true,
    subItems: {
      videos: {
        caption: 'menu.home',
        type: 'videos.list',
        visible: true,
        subItems: {
          player: {
            type: 'videos.player',
            caption: 'menu.video_player'
          },
          upload: {
            type: 'videos.upload',
            caption: 'menu.video_upload'
          },
          edit: {
            type: 'videos.subtitles',
            caption: 'menu.video_subtitles'
          }
        }
      },
      users: {
        caption: 'menu.users',
        visible: true,
        subItems: {
          add: {
            type: 'users.add',
            caption: 'menu.user_add'
          },
          edit: {
            type: 'users.add',
            caption: 'menu.user_edit'
          },
          edit: {
            type: 'users.import',
            caption: 'menu.user_import'
          },
          info: {
            type: 'users.info',
            caption: 'menu.user_info'
          }
        }
      },
      groups: {
        caption: 'menu.groups',
        type: 'group.list',
        visible: true,
        subItems: {
          edit: {
            type: 'groups.edit',
            caption: 'menu.group_edit'
          },
          add: {
            type: 'groups.add',
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
            type: 'roles.edit',
            caption: 'menu.role_edit'
          },
          add: {
            type: 'roles.add',
            caption: 'menu.role_add'
          }
        }
      },
      series: {
        caption: 'menu.series',
        type: 'series.list',
        visible: true,
        subItems: {
          edit: {
            type: 'series.edit',
            caption: 'menu.series_edit'
          },
          add: {
            type: 'series.add',
            caption: 'menu.series_add'
          }
        }
      },
      binding: {
        caption: 'menu.binding',
        type: 'binding.list',
        visible: true
      },
      history: {
        caption: 'menu.history_info',
        type: 'history.list',
        visible: true
      }
    }
  },

  user: {
    isOpen: true,
    visible: true,
    subItems: {
      videos: {
        caption: 'menu.home',
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
      }
    }
  }
}

export default {
  state: {
    visible: false,
    menu: {
      list: {},
      activeItem: false
    }
  },
  actions: {
    LOAD_MENU_STATE: ({dispatch}) => {
      if (localStorage.getItem('vcms-activ-menu')) {
        try {
          const act_item = JSON.parse(localStorage.getItem('vcms-activ-menu'))
          const _item = act_item ? act_item : '/hub/videos/?page=1'
        } catch (e) {
          localStorage.removeItem('vcms-activ-menu')
        }
      }
    },

    //CLEAR_MENU_STATE: () => localStorage.removeItem('vcms-activ-menu'),

    SAVE_MENU_STATE: ({state}) => {
      localStorage.setItem(
        'vcms-activ-menu',
        JSON.stringify(state.menu.activeItem)
      )
    },
    LOAD_USER_MENU: async ({commit}, userMenuType) => {
      if (userMenuType) {
        commit('SET_USER_MENU', menuStructure[userMenuType])
      }
    },
    MENU_NAVIGATE: ({commit, dispatch}, navTo) => {
      //const {path: navFrom, meta} = router.currentRoute
      // if (navTo === navFrom)
      // {
      //   commit('ITEM_STATE', navTo)
      //   dispatch('SAVE_MENU_STATE')
      // }

      //commit('ITEM_STATE', navTo)
      router.push({path: navTo})
    }
  },
  mutations: {
    SET_USER_MENU: (state, userMenu) => {
      state.menu.list = {...userMenu}
    },
    SECTION_STATE: (state, section) => {
      let sec = findPropByName(state.menu.list, section)
      if (sec.isSection) {
        sec.isOpen = !sec.isOpen
      }
    },
    ITEM_STATE: (state, item) => {
      state.menu.activeItem = item
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
    userMenu: (state) => state.menu.list,
    userMenuVisible: (state) => Boolean(state.visible),
    userMenuActiveItem: (state) => state.menu.activeItem
  }
}
