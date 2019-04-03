<template>
  <div class='content'>
    <component v-bind:is="activePage" v-on:contentElementClick="contentElementClick"></component>
  </div>  
</template>

<script>
  import { mapGetters } from 'vuex'
  import root_home from '../video-catalog'
  import root_messages from '../messages'
  
  export default {
    name: "content-area",
    computed: {
      ...mapGetters(['userMenuActiveItem']),
      activePage() {
        let activeItem = 'root_home'
        if (this.userMenuActiveItem) {
          activeItem = this.userMenuActiveItem
          activeItem = activeItem.replace(/\.subItems/g, '').replace(/\./g, '_')
        }
        return activeItem
      }
    },
    methods: {
      contentElementClick(key) {
        console.log('key=', key)
        this.$store.commit('ITEM_STATE', key)
        this.$store.dispatch('SAVE_MENU_STATE') 
      }
    },
    components: {
      root_home,
      root_messages
    }
  }
</script> 

<style lang="scss">
  .content {
    padding: 20px 20px;
    width: 100%;
  }
</style>