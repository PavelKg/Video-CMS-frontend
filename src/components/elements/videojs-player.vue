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
      loop
      preload="auto"
    ></video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'videojs-flash'

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
        techOrder: ['html5', 'flash'],
        //preload: 'metadata',
        hls: {overrideNative: true},
        responsive: true,
        html5: {nativeAudioTracks: false}
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
