<template>
  <div>
    <div v-if="!videoHasUrl">Sorry, file not found !!!</div>
    <div v-else class="video-content">
      <span class="video-title">{{active_video.title}}</span>
      <div class="video-content-zone">
        <div class="player-zone">
          <video ref="videoPlayer" controls class="player-zone-content"></video>
          <div class="comment-input">
            <input/>
            <div class="send-button blue">{{$t('label.send')}}</div>
          </div>
        </div>
        <div class="video-information">
          <span class="title">Video Information</span>
          <span class="sub-title">Last modified:</span>
          <span class="value">{{active_video.last_mod.toLocaleDateString('en-US')}}</span>
          <span class="sub-title">Tag:</span>
          <span class="value">{{active_video.tag}}</span>
          <span class="sub-title">Description:</span>
          <span class="value">{{active_video.description}}</span>
        </div>
      </div>
      <videoComments class="comments-box"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Hls from 'hls.js'
import videoComments from '@/components/elements/table-comments'

export default {
  name: 'video-player',
  computed: {
    ...mapGetters(['active_video']),
    videoHasUrl() {
      return this.active_video && this.active_video.hasOwnProperty('url')
    }
  },
  components: {
    videoComments
  },
  mounted() {
    if (this.videoHasUrl) {
      let video = this.$refs.videoPlayer
      if (Hls.isSupported()) {
        var hls = new Hls()
        hls.loadSource(this.active_video.url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.play()
        })
      } else {
        addSourceToVideo(
          video,
          'https://p0.oc.kg:8081/video/c/hd3/Mortal_Engines_HD.mp4',
          'video/mp4'
        )
        video.play()
      }

      function addSourceToVideo(element, src, type) {
        var source = document.createElement('source')
        source.src = src
        source.type = type
        element.appendChild(source)
      }
    }
  }
}
</script>

<style lang="scss">
.video-title {
  padding: 50px 0 0 20px;
  font-weight: bold;
  font-size: 20px;
}
.comments-box {
  width: 970px;
  height: 200px;
  overflow-y: auto;
}
.video-content-zone {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: stretch;
  width: 100%;
  align-items: flex-start;
  .player-zone {
    display: flex;
    flex-direction: column;
    .player-zone-content {
      width: 670px;
      height: 375px;
    }
    .comment-input {
      margin: 10px 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      border: 0px solid #000000;
      height: 40px;
      input {
        width: 100%;
        padding: 10px;
      }
      .send-button {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        width: 100px;
        color: #ffffff;
      }
      .blue {
        background: #4472c4;
      }

    }
  }
  .video-information {
    padding: 10px;
    margin-left: 10px;
    width: 300px;
    display: flex;
    flex-direction: column;
    border: 1px solid #000000;
    span.title {
      text-align: center;
      padding: 10px 0 20px 0;
      font-weight: bold;
      font-size: 16px;
    }
    span.sub-title {
      padding: 20px 0 0px 0;
      font-weight: bold;
    }
  }
}
</style>
