<template>
  <div class="menu-table">
    <menu-tree
      :node="menuItems"
      :myKey="''"
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
  data() {
    return {
      menuTree: {}
    }
  },
  computed: {
    ...mapGetters(['userMenu']),
    menuItems() {
      return this.userMenu
    }
  },
  methods: {
    handleClick(node, key) {
      console.log(node, key)
      if (node.isSection) {
        this.$store.commit('SECTION_STATE', key)
      } else if (!node.isSection) {
        this.$store.commit('MENU_HIDE')
        this.$store.dispatch('MENU_NAVIGATE', key)
      }
    }
  }
}
</script>

<style lang="scss">
.menu-table {
  display: flex;
  padding: 10px 8px 15px 8px;
  flex-direction: column;
  flex: 1 1 0;
  font-size: 24px;
}
</style>
