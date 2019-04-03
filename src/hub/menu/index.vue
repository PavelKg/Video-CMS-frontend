<template>
  <div class="menu-table">
    <menu-tree :node="menuItems" :myKey="'root'" :handle-click="handleClick"></menu-tree>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    };
  },
  computed: {
    ...mapGetters(['userMenu', 'userMenuActiveItem']),
    menuItems() {
      return this.userMenu.root
    }
  },
  methods: {
    handleClick(node, key) {
      if (node.isSection) {
        this.$store.commit('SECTION_STATE', key)
      } else if (!node.isSection) {
        if (key.search(/company.subItems.add/gi) >= 0) {
          this.$store.commit('SET_ACTIVE_COMPANY', '')
          this.$store.dispatch('SAVE_COMPANY_STATE')  
        }
        if (key.search(/settings.subItems.adminAdd/gi) >= 0) {
          this.$store.dispatch('SET_ACTIVE_ADMIN', '')
        }
        this.$store.commit('ITEM_STATE', key)
      }
      this.$store.dispatch('SAVE_MENU_STATE')
    }
    
  }
};
</script>  

<style lang='scss'>
  .menu-table {
    display: flex;
    padding: 10px 0;
    flex-direction: column;
    flex: 1 1 0;
    font-size: 24px;
  }
</style>