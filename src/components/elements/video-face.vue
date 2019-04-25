<template>
  <div class="video-box-item">
    <div class="video-box-item-content" @click="playVideo">
      <img :src="img_puth" />
    </div>
    <div class="video-box-mng-panel">
      <b-form-checkbox :id="tag" :name="tag"></b-form-checkbox>
      <span :title="`${description}`">{{ description }}</span>
      <img
        @click="onSubtitles()"
        class="subtitles-svg"
        src="@/assets/images/subtitles.svg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'video-face-box',
  props: {
    videoitem: Object
  },
  methods: {
    playVideo() {
      this.$store.commit('SET_ACTIVE_VIDEO', this.videoitem)
      this.$store.commit('GET_COMMENTS')
      this.$emit(
        'activateContent',
        'root.subItems.videos.subItems.video_player'
      )
    },
    onSubtitles() {
      this.$store.commit('SET_ACTIVE_VIDEO', this.videoitem)
      this.$emit(
        'activateContent',
        'root.subItems.videos.subItems.video_subtitles'
      )
    }
  },
  computed: {
    description() {
      return this.videoitem['description']
    },
    tag() {
      return `check-tag-${this.videoitem.tag}`
    },
    img_puth() {
      const num = Math.round(Math.random() * 5) + 1
      var images = require.context('@/assets/images/fake-face', false, /\.png$/)
      return images('./' + num + '.png')
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
    img {
      width: 100%;
      cursor: pointer;
    }
  }
  .video-box-mng-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    background: #ddd;
    padding: 0 5px;
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
}

@media screen and (max-width: 508px) {
  .video-box-item {
    width: 400px
  }
}
</style>
