<template>
  <div>
    <div v-if="!videoHasUrl">Sorry, file not found !!!</div>
    <div v-else class="video-content">
      <span class="video-title">{{ form.video_title }}</span>
      <div class="video-content-zone">
        <div class="player-zone">
          <video ref="videoPlayer" controls class="player-zone-content"></video>
          <div class="video-information">
            <div>
              <span class="title">{{ $t('videos.video_information') }}</span>
            </div>

            <div>
              <span class="sub-title">{{ $t('videos.last_modified') }}:</span>
              <span class="value">{{ form.updated_at }}</span>
            </div>

            <div>
              <span class="sub-title">{{ $t('videos.tag') }}:</span>
              <span class="value">{{ form.video_tag }}</span>
            </div>

            <div>
              <span class="sub-title"
                >{{ $t('videos.video_description') }}:</span
              >
              <span class="value">{{ form.video_description }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-input">
        <input />
        <button class="button btn-blue">{{ $t('label.send') }}</button>
      </div>
      <videoComments />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Hls from 'hls.js'
import videoComments from '@/components/elements/table-comments'

export default {
  name: 'video-player',
  data() {
    return {
      form: {
        video_title: '',
        updated_at: '',
        video_tag: '',
        video_descrioption: '',
        video_url:
          'https://storage.googleapis.com/p-streamcms/bitmovin/encoding-ui/40040e8d-fbfa-49b9-bde1-d367683a0adb/2019-03-28T10-20-18Z/162eb810-5143-11e9-929f-8d50de7b40e9/manifest.m3u8',
        //'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'
        video_public: true
      }
    }
  },
  computed: {
    ...mapGetters(['active_video_uuid']),

    videoHasUrl() {
      return true //this.active_video && this.active_video.hasOwnProperty('url')
    }
  },
  components: {
    videoComments
  },
  created() {
    this.$store.dispatch('LOAD_COMMENTS')
    this.$store
      .dispatch('LOAD_VIDEO_INFO_BY_UUID', this.active_video_uuid)
      .then(res => {
        this.form = {...this.form, ...res}
      })
  },
  mounted() {
    if (this.videoHasUrl) {
      let video = this.$refs.videoPlayer
      if (Hls.isSupported()) {
        var hls = new Hls()
        hls.loadSource(this.form.video_url)
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
@import '../../assets/styles';

.video-title {
  font-size: 1.4em;
  color: $link;
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
      justify-content: flex-start;
      flex-wrap: wrap;
      
      video {
        width: 100%;
        max-width: 670px;
        height: auto;
      }
      .video-information {
        //padding: 10px;
        //margin-left: auto;
        max-width: 200px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        //border: 1px solid #000000;
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
  }

  .comment-input {
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    input {
      width: 100%;
      height: 40px;
      border: 1px solid $link;
      padding: 10px;
      border-radius: 5px;
    }
    button {
      margin-left: 10px;
    }
  }
//}
</style>
