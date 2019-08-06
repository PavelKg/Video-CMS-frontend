<template>
  <div class="menu-table">
    <menu-tree
      :node="menuItems"
      :myKey="'/hub'"
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
      return this.userMenu
    }
  },
  watch: {
    $route: function(value) {
      console.log('$route-value=', value, value.meta.menuItem)
      this.$store.commit('ITEM_STATE', value.fullPath)
      this.$store.dispatch('SAVE_MENU_STATE')
    }
  },
  methods: {
    handleClick(node, key) {
      if (node.isSection) {
        this.$store.commit('SECTION_STATE', key)
      } else if (!node.isSection) {
        this.$store.dispatch('MENU_NAVIGATE', key)
      }
      //this.$store.dispatch('SAVE_MENU_STATE')
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
