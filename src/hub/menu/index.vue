<template>
  <div class="menu-table">
    <menu-tree
      :node="menuItems"
      :myKey="'root'"
      :handle-click="handleClick"
    ></menu-tree>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MenuTree from './MenuTree'

export default {
  name: 'menu-area',
  components: {
    MenuTree
  },
  mounted() {},
  data() {
    return {
      menuTree: {}
    }
  },
  computed: {
    ...mapGetters(['userMenu', 'userMenuActiveItem', 'me']),
    menuItems() {
      return this.userMenu.root
    }
  },
  methods: {
    handleClick(node, key) {
      if (node.isSection) {
        this.$store.commit('SECTION_STATE', key)
      } else if (!node.isSection) {
        console.log('menu_key=', key)
        this.$store.commit('MENU_HIDE')
        switch (key) {
          case 'root.subItems.roles':
            break
          case 'root.subItems.home':
            break
          case  'root.subItems.users':
            break
          default:
            break
        }
        this.$store.commit('ITEM_STATE', key)
      }
      this.$store.dispatch('SAVE_MENU_STATE')
    }
  }
}
</script>

<style lang="scss">
.menu-table {
  display: flex;
  padding: 10px 8px;
  flex-direction: column;
  flex: 1 1 0;
  font-size: 24px;
}
</style>
