<template>
  <div class="preview-video">
    <template v-if="!videoHasUrl">
      <div>Loading data from server...</div>
    </template>
    <template v-else>
      <span class="video-title">{{ form.video_title || 'Video Title' }}</span>
      <div class="video-content-zone">
        <VideoPlayer :videourl="videoUrl" />
        <div class="video-information">
          <div>
            <span class="title">{{ $t('videos.video_information') }}</span>
            <div class="video-information-row">
              <span class="sub-title ">{{ $t('videos.last_modified') }}:</span>
              <span class="value wraped">{{ updated_at }}</span>
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
            <template v-if="!isUser">
              <button @click="onSubtitles" class="button btn-grey">
                {{ $t('label.edit') }}
              </button>
            </template>
          </div>
          <template v-if="!isUser">
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
          </template>
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
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import VideoPlayer from '@/components/elements/videojs-player'
//import VideoPlayer  from '@/components/elements/temp_player'
import Comment from '@/components/elements/comment'

export default {
  name: 'p-video-player',
  data() {
    return {
      active_video_uuid: undefined,
      videoUrl: '',
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
      comment_sending: false,
      videoHasUrl: false
    }
  },
  computed: {
    ...mapGetters(['comment_list', 'me']),

    updated_at() {
      return this.form.updated_at
        ? this.form.updated_at
            //new Date(this.form.updated_at)
            //  .toISOString()
            .slice(0, 19)
            .replace(/\-/gi, '/')
            .replace(/T/gi, ' ')
        : ''
    },
    public_status() {
      return this.form.video_public ? 'public' : 'private'
    },
    isUser() {
      return this.me.profile.irole === 'user'
    }
  },
  components: {
    Comment,
    VideoPlayer
  },
  created() {
    const {uuid = null} = this.$route.params
    this.active_video_uuid = uuid
    console.log('uuid=', uuid)
    this.$store
      .dispatch('LOAD_VIDEO_INFO_BY_UUID', this.active_video_uuid)
      .then((res) => {
        console.log('res.video_output_file=', res.video_output_file)
        this.videoHasUrl = true
        this.form = {...this.form, ...res}
        this.videoUrl = res.video_output_file
      })
    this.$store.dispatch('LOAD_COMMENTS', this.active_video_uuid)
  },
  mounted() {},
  methods: {
    onSubtitles() {
      this.$emit(
        'contentElementClick',
        `/hub/videos_subtitles/uuid/${this.active_video_uuid}`
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

.wraped {
  padding: 0;
  flex-grow: 2;
}

.comment-table {
  display: flex;
  min-width: 100%;
  flex-direction: column;
  height: 300px;
  overflow-y: auto;
}

.video-title {
  font-size: 1.4em;
  color: $link;
}
.video-content-zone {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  span.title {
    font-weight: bold;
    font-size: 1.3em;
  }
  .video-information {
    width: 20rem;
    //width: 220px;
    display: flex;
    flex-direction: column;
    //flex-wrap: wrap;
    justify-content: flex-start;
    margin-left: auto;
    flex-wrap: wrap;
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

@media screen and (max-width: 610px) {
  .video-content-zone {
    flex-wrap: wrap;
  }
  .video-information {
    align-self: stretch;
    min-width: 100%;
  }
}

@media screen and (max-width: 875px) and (min-width: 610px) {
  .video-content-zone {
    flex-wrap: wrap;
  }
  .video-information {
    align-self: stretch;
    min-width: 100%;
  }
}
</style>
