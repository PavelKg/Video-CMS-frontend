<template>
  <div class="content">
    <component
      v-bind:is="activePage"
      v-on:contentElementClick="contentElementClick"
    ></component>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import root_home from '@/hub/templates/video-catalog'
import root_messages from '@/hub/templates/messages'
import root_users from '@/hub/templates/users-list'
import root_groups from '@/hub/templates/groups'
import root_groups_group_add from '@/hub/templates/groups/mng'
import root_groups_group_edit from '@/hub/templates/groups/mng'
import root_roles from '@/hub/templates/roles/'
import root_roles_role_add from '@/hub/templates/roles/mng'
import root_roles_role_edit from '@/hub/templates/roles/mng'
import root_screen from '@/hub/templates/screen'
import root_videos_video_player from '@/hub/templates/video-player'
import root_videos_video_upload from '@/hub/templates/video-upload'
import root_videos_video_subtitles from '@/hub/templates/video-subtitles'

export default {
  name: 'content-area',
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
  mounted() {
    this.$store.dispatch('LOAD_VIDEO_LIST')
  },
  components: {
    root_home,
    root_users,
    root_messages,
    root_groups,
    root_groups_group_add,
    root_groups_group_edit,    
    root_roles,
    root_roles_role_add,
    root_roles_role_edit,
    root_screen,
    root_videos_video_player,
    root_videos_video_upload,
    root_videos_video_subtitles
  }
}
</script>

<style lang="scss">
.content {
  padding: 20px 20px;
  width: 100%;
}
</style>
