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
    ...mapGetters(['userMenu', 'me']),
    menuItems() {
      return this.userMenu
    }
  },
  watch: {
    $route: function(value) {
      this.$store.commit('ITEM_STATE', value.fullPath)
      this.$store.dispatch('SAVE_MENU_STATE')
    }
  },
  methods: {
    handleClick(node, key) {
      if (node.isSection) {
        this.$store.commit('SECTION_STATE', key)
      } else if (!node.isSection) {
        console.log('MENU_NAVIGATE FROM MENU = ', key)
        this.$store.dispatch('MENU_NAVIGATE', key)
      }
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
