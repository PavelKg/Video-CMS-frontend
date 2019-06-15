<template>
  <div class="video-box-item">
    <div class="video-box-item-content" @click="playVideo">
      <img v-if="img_path" :src="img_path" />
      <img v-else src="@/assets/images/p-streamCMS-s.png" />
    </div>
    <div class="video-box-mng-panel">
      <div class="mng-panel-top">
        <b-form-checkbox :id="tag" :name="tag"></b-form-checkbox>
        <span :title="`${description}`">{{ title }}</span>
        <img
          v-if="showSubtitles"
          @click="onSubtitles()"
          class="subtitles-svg"
          src="@/assets/images/subtitles.svg"
        />
      </div>
      <div class="mng-panel-bottom">
        <span>{{ `${$t('videos.last_modified')}: ${updated_at}` }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'video-face-box',
  props: {
    videoitem: Object
  },
  methods: {
    playVideo() {
      this.$store.commit('SET_ACTIVE_VIDEO', this.videoitem.uuid)
      this.$store.commit('GET_COMMENTS')
      this.$emit(
        'activateContent',
        'root.subItems.videos.subItems.video_player'
      )
    },
    onSubtitles() {
      this.$store.commit('SET_ACTIVE_VIDEO', this.videoitem.uuid)
      this.$store.dispatch('SAVE_ACTIVE_VIDEO_UUID')
      this.$emit(
        'activateContent',
        'root.subItems.videos.subItems.video_subtitles'
      )
    }
  },
  computed: {
    ...mapGetters(['me']),
    description() {
      return this.videoitem.video_description
    },
    updated_at() {
      return this.videoitem.updated_at
        ? new Date(this.videoitem.updated_at)
            .toISOString()
            .slice(0, 19)
            .replace(/\-/gi, '/')
            .replace(/T/gi, ' ')
        : ''
    },
    title() {
      return this.videoitem.video_title
    },
    tag() {
      return `check-tag-${this.videoitem.video_tag}`
    },
    img_path() {
      // const num = Math.round(Math.random() * 5) + 1
      // var images = require.context('@/assets/images/fake-face', false, /\.png$/)
      // //console.log('images=', images())
      // return images('./' + num + '.png')

      return this.videoitem.video_thumbnail ? `data:image/jpeg;base64,${this.videoitem.video_thumbnail}` : null
    },
    showSubtitles() {
      return this.me.profile.irole === 'admin'
    }
  }
}
</script>

<style lang="scss" scoped>
.video-box-item {
  margin: 10px;
  width: 200px;
  height: 100%;
  .video-box-item-content {
    display: flex;
    flex-direction: column;
    height: 84px;
    img {
      width: 100%;
      cursor: pointer;
    }
  }
  .video-box-mng-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    //background: #ddd;
    padding: 0 5px;
    .mng-panel-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .subtitles-svg {
        margin-left: auto;
        cursor: pointer;
      }
    }
    .mng-panel-bottom {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 0.75em;
    }
  }
}

@media screen and (max-width: 610px) {
  .video-box-item {
    width: 400px;
  }
  .mng-panel-bottom {
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 875px) and (min-width: 610px) {
  .video-box-item {
    width: 250px;
  }
    .mng-panel-bottom {
      font-size: 1.3em;
    }
}
</style>
