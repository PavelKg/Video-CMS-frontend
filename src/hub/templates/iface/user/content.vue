<template>
  <div class='content'>
    <component v-bind:is="activePage" v-on:contentElementClick="contentElementClick"></component>
  </div>  
</template>

<script>
  import { mapGetters } from 'vuex'
  import root_home from '@/hub/templates/video-catalog'
  import root_messages from '@/hub/templates/messages'
  import root_videos_video_player from '@/hub/templates/video-player'
  
  export default {
    name: "content-area",
    created() {
      this.$store.dispatch('LOAD_VIDEO_LIST')
    },
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
      root_messages,
      root_videos_video_player
    }
  }
</script> 

<style lang="scss">
  .content {
    padding: 20px 20px;
    width: 100%;
  }
</style>