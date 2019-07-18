<template>
  <div>
    <video ref="videoPlayer" class="video-js vjs-big-play-centered"></video>
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
        fluid: true
      }
    }
  },
  watch: {
    video_url(new_val, old_val){
      if(Boolean(new_val)){
        this.player.src({src: new_val})
      }
    }
  },
  mounted() {
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        //console.log('onPlayerReady', this)
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
