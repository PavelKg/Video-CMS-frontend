import router from '@/router'
import Api from '@/api'

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

export default {
  state: {
    visible: false,
    menu: {
      defList: {
        subItems: {
          videos: {
            caption: 'menu.home',
            visible: true
          }
          // messages: {
          //   caption: 'menu.messages',
          //   visible: true
          // }
        }
      },
      list: {},
      activeItem: false
    }
  },
  actions: {
    // LOAD_MENU_STATE: ({dispatch}) => {
    //   if (localStorage.getItem('vcms-activ-menu')) {
    //     try {
    //       const act_item = JSON.parse(localStorage.getItem('vcms-activ-menu'))
    //       const _item = act_item ? act_item : '/videos/?page=1'
    //     } catch (e) {
    //       localStorage.removeItem('vcms-activ-menu')
    //     }
    //   }
    // },

    // //CLEAR_MENU_STATE: () => localStorage.removeItem('vcms-activ-menu'),

    // SAVE_MENU_STATE: ({state}) => {
    //   localStorage.setItem(
    //     'vcms-activ-menu',
    //     JSON.stringify(state.menu.activeItem)
    //   )
    // },
    LOAD_USER_MENU: async ({commit}) => {
      try {
        const result = await Api.load_user_menu()
        if (result.status === 200 && result.data) {
          const {menu} = result.data
          commit('SET_USER_MENU', menu)
        }
      } catch (err) {
        throw err.response.data
      }
    },
    MENU_NAVIGATE: ({commit, dispatch}, navTo) => {
      router.push({path: navTo}).catch((err) => {
        console.log({err})
        /* 'Uncaught (in promise) undefined' in the console without it*/
      })
    }
  },
  mutations: {
    SET_USER_MENU: (state, userMenu) => {
      const mixMenu = Object.assign(
        {},
        state.menu.defList.subItems,
        userMenu.subItems
      )

      state.menu.list = {isOpen: true, visible: true, subItems: {...mixMenu}}
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
    subMenuItem: (state) => (subname) => state.menu.list.subItems[subname],
    userMenuVisible: (state) => Boolean(state.visible),
    userMenuActiveItem: (state) => state.menu.activeItem
  }
}
