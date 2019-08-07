<template>
  <div class="player-item">
    <video
      ref="videoPlayer"
      class="video-js vjs-big-play-centered"
      width="100%"
      height="100%"
      data-setup='{
        "fluid": "true",
        "aspectRatio":"16:9"}'
    ></video>
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  name: 'VideoPlayer',
  props: {
    video_url: String
  },
  data() {
    return {
      player: null,
      options: {
        controls: true,
        autoplay: 'true',
        //preload: 'auto',
        hls: {overrideNative: true}
      }
    }
  },
  watch: {
    video_url(new_val, old_val) {
      if (Boolean(new_val)) {
        this.player.src({src: new_val})
      }
    }
  },
  mounted() {
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {}
    )
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style lang="scss"></style>
