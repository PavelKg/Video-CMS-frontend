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
    const eventHandler = this.onEvent
    const secToHour = this.secToHour

    this.player_options.sources[0].src = this.videourl

    this.player = videojs(
      this.$refs.videoPlayerJS,
      this.player_options,
      function onPlayerReady() {
        //console.log('Player Ready!!!')
      }
    )
    const _player = this.player
    // this.player.on('timeupdate', function() {
    //   //console.log(_player.currentTime())
    // })

    this.player.on('play', function(e) {
      let action = 'resumed'
      let data = {type: 'resumed', time: this.currentTime()}
      let details = `playback (${secToHour(this.currentTime())})`

      if (parseInt(this.currentTime()) < 2) {
        action = 'started'
        data = {type: 'started'}
        details = `playback`
      }

      eventHandler({action, data, details})
    })

    this.player.on('pause', function(e) {
      if (this.currentTime() === this.duration()) {
        return
      }
      const answ = {
        action: 'suspended',
        data: {type: 'suspended', time: this.currentTime()},
        details: secToHour(this.currentTime())
      }
      eventHandler(answ)
    })

    this.player.on('ended', function(e) {
      const answ = {
        action: 'completed',
        data: {type: 'completed', time: this.currentTime()},
        details: 'playback all'
      }
      eventHandler(answ)
      //eventToDataLayer(this, '100%', this.currentTime())
    })

    this.player.on('seeking', function(e) {
      //console.log('this.currentTime()=', this.currentTime())
      //eventToDataLayer(this, 'Timeline Jump', this.currentTime())
    })
  },
  beforeDestroy() {
    const answ = {
      action: 'closed',
      data: {type: 'closed', time: this.player.currentTime()},
      details: `closed (${this.secToHour(this.player.currentTime())})`
    }
    this.onEvent(answ)
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    onEvent(evt) {
      const {action = '', data = '', details = ''} = evt
      const event = {
        event_action: action,
        event_data: data,
        event_details: details,
        event_result: 's'
      }
      this.$emit('onPlayerEvent', event)
    },
    secToHour(sec) {
      return new Date(sec * 1000).toISOString().substr(11, 8)
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
