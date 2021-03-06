<template>
  <div>
    <div v-if="!videoHasUrl">Sorry, file not found !!!</div>
    <div v-else class="video-content">
      <span class="video-title">{{ form.video_title || 'Video Title' }}</span>
      <div class="video-content-zone">
        <div class="player-zone">
          <video ref="videoPlayer" controls class="player-zone-content"></video>
          <div class="video-information">
            <div>
              <span class="title">{{ $t('videos.video_information') }}</span>
              <div class="video-information-row">
                <span class="sub-title">{{ $t('videos.last_modified') }}:</span>
                <span class="value">{{ updated_at }}</span>
              </div>

              <div class="video-information-row">
                <span class="sub-title">{{ $t('videos.tag') }}:</span>
                <span class="value">{{ form.video_tag }}</span>
              </div>

              <div class="video-information-row">
                <span class="sub-title"
                  >{{ $t('videos.video_description') }}:</span
                >
                <span class="value">{{ form.video_description }}</span>
              </div>
              <button @click="onSubtitles" class="button btn-grey">
                {{ $t('label.edit') }}
              </button>
            </div>
            <div>
              <span class="sub-title">
                {{ $t('videos.public_settings') }}:
              </span>
              <b-form-radio-group
                id="radio-public-set"
                :checked="public_status"
                @change="onChangePublic"
                :options="options"
                name="radio-options"
              >
              </b-form-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-input">
        <input v-model="comment_text" />
        <button
          :disabled="comment_sending"
          @click="addComment"
          class="button btn-blue"
        >
          {{ $t('label.send') }}
        </button>
      </div>
      <div class="comment-table">
        <Comment
          v-for="comment in comment_list"
          :comment="comment"
          :key="comment.comment_id"
          :video_uuid="form.video_uuid"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
//import Hls from 'hls.js'
import Comment from '@/components/elements/comment'

export default {
  name: 'video-player',
  data() {
    return {
      video: null,
      hls: null,
      comment_text: '',
      form: {
        video_title: '',
        updated_at: '',
        video_tag: '',
        video_descrioption: '',
        video_output_file: '',
        video_public: true
      },
      options: [
        {text: this.$t('label.public'), value: 'public'},
        {text: this.$t('label.private'), value: 'private'}
      ],
      comment_sending: false
    }
  },
  computed: {
    ...mapGetters(['active_video_uuid', 'comment_list']),

    videoHasUrl() {
      return true //this.active_video && this.active_video.hasOwnProperty('url')
    },
    isHlsSupported() {
      return Hls.isSupported()
    },
    updated_at() {
      return this.form.updated_at
        ? new Date(this.form.updated_at)
            .toISOString()
            .slice(0, 19)
            .replace(/\-/gi, '/')
            .replace(/T/gi, ' ')
        : ''
    },
    public_status() {
      return this.form.video_public ? 'public' : 'private'
    }
  },
  components: {
    Comment
  },
  created() {
    this.$store.dispatch('LOAD_COMMENTS', this.active_video_uuid)
  },
  mounted() {
    this.video = this.$refs.videoPlayer
    this.$store
      .dispatch('LOAD_VIDEO_INFO_BY_UUID', this.active_video_uuid)
      .then((res) => {
        this.form = {...this.form, ...res}
        if (Hls.isSupported()) {
          this.hls = new Hls()
          this.hls.loadSource(this.form.video_output_file)
          this.hls.attachMedia(this.video)
          this.hls.on(Hls.Events.MANIFEST_PARSED, function(event, data) {})
        }
      })
  },
  methods: {
    onSubtitles() {
      this.$store.commit('SET_ACTIVE_VIDEO', this.form.video_uuid)
      this.$store.dispatch('SAVE_ACTIVE_VIDEO_UUID')
      this.$emit(
        'contentElementClick',
        '/videos/edit'
      )
    },
    onChangePublic(val) {
      this.$store.dispatch('UPDATE_VIDEO_PUBLIC_STATUS', {
        uuid: this.form.video_uuid,
        value: val
      })
    },
    addComment() {
      this.comment_sending = true
      this.$store
        .dispatch('ADD_COMMENT', {
          uuid: this.form.video_uuid,
          text: this.comment_text
        })
        .then((res) => {}, (err) => {})
        .finally(() => {
          this.comment_text = ''
          this.comment_sending = false
        })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';

.comment-table {
  height: 300px;
  overflow: auto;
}

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
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    video {
      width: 100%;
      max-width: 670px;
      height: auto;
      margin-right: 10px;
    }
    span.title {
      font-weight: bold;
      font-size: 1.3em;
    }
    .video-information {
      max-width: 180px;
      display: flex;
      flex-direction: column;
      //flex-wrap: wrap;
      justify-content: flex-startn;
      .video-information-row {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin-top: 10px;
        span.sub-title {
          font-weight: bold;
          font-size: 1rem;
        }
        span.value {
          font-size: 0.9rem;
          color: $link;
        }
      }
      .button {
        margin-top: auto;
        margin: 10px 0;
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
