<template>
  <div class="player-item">
    <video
      ref="videoPlayerJS"
      class="video-js vjs-big-play-centered"
      width="100%"
      height="100%"
      data-setup='{
        "fluid": "true",
        "aspectRatio":"16:9"}'
      preload="auto"
    />
  </div>
</template>

<script>
import videojs from 'video.js'
import 'videojs-flash'

export default {
  name: 'component-VideoPlayer',
  props: {videourl: String},
  data() {
    return {
      player: null,
      player_options: {
        controls: true,
        autoplay: 'true',
        techOrder: ['html5', 'flash'],
        //preload: 'metadata',
        hls: {overrideNative: true},
        responsive: true,
        html5: {nativeAudioTracks: false},
        sources: [{src: ''}]
      }
    }
  },
  mounted() {
    this.player_options.sources[0].src = this.videourl
    this.player = videojs(
      this.$refs.videoPlayerJS,
      this.player_options,
      function onPlayerReady() {
        //console.log('Player Ready!!!')
      }
    )
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style lang="scss">
.player-item {
  width: 100%;
  align-self: stretch;
  margin-right: 10px;
}
</style>
