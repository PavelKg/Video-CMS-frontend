<template>
  <div class="preview-video">
    <template v-if="!videoHasUrl">
      <div>Loading data from server...</div>
    </template>
    <template v-else>
      <div
        class="video-content-zone "
        :class="{'flex-column': isInfoLocationBottom}"
      >
        <VideoPlayer :videourl="videoUrl" @onPlayerEvent="onPlayerEvent" />

        <b-container
          fluid
          class="pb-2 pl-0 bg-default"
          :class="[!isInfoLocationBottom ? 'next-position' : 'pt-3']"
        >
          <b-row class="">
            <b-col
              ><!--span>{{ $t('videos.tag') }}:</span-->
              <template v-for="tag in tags">
                <a
                  href=""
                  :key="tag"
                  class="font-weight-light text-decoration-none"
                  @click.prevent.stop=""
                  >{{ `#${tag}` }}</a
                >
                <span class="pl-1 value" :key="`span-${tag}`"> </span>
              </template>
            </b-col>
          </b-row>
          <span class="video-title">{{
            form.video_title || $t('videos.no_title')
          }}</span>
          <p v-if="1 === 2" class="title">
            {{ $t('videos.video_information') }}
          </p>
          <b-row class="pt-2">
            <b-col>
              <span class="value">{{ $t('videos.last_modified') }}:</span>
              <span class="pl-1 value">{{ updated_at }}</span>
            </b-col>
          </b-row>

          <b-row
            class="my-2 mx-0"
            :class="[{'border-top': multilineText.length > 0}, 'border-bottom']"
          >
            <b-col class="px-0">
              <!--span>{{ $t('videos.video_description') }}:</span-->
              <span class="text-break" :style="{'white-space': 'pre-wrap'}">{{
                multilineText
              }}</span>
            </b-col>
          </b-row>
          <template v-if="!isUser">
            <b-row class="pt-2">
              <b-col>
                <button @click="onSubtitles" class="button btn-grey">
                  {{ $t('label.edit') }}
                </button></b-col
              ></b-row
            >
          </template>

          <template v-if="!isUser">
            <b-row class="my-2 mx-0 border-bottom">
              <b-col class="py-2 px-0">
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
              </b-col>
            </b-row>
          </template>
        </b-container>
      </div>

      <template v-if="form.commentbox_visible">
        <div class="comment-input">
          <b-form-group
            class="comment-text-group"
            :invalid-feedback="validateErrorMessage('comment_text')"
            :state="validateState('comment_text')"
          >
            <b-form-textarea
              v-model="mnComment.comment_text"
              rows="1"
              max-rows="8"
          /></b-form-group>

          <button
            :disabled="comment_sending || !mnComment.comment_text === ''"
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
    </template>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import VideoPlayer from '@/components/elements/videojs-player'
//import VideoPlayer  from '@/components/elements/temp_player'
import Comment from '@/components/elements/comment'
import validMixin from '@/mixins/validation'

export default {
  name: 'p-video-player',
  mixins: [validMixin],
  data() {
    return {
      active_video_uuid: undefined,
      videoUrl: '',
      validFormName: 'mnComment',
      mnComment: {comment_text: ''},
      form: {
        video_title: '',
        updated_at: '',
        video_tag: '',
        video_descrioption: '',
        video_output_file: '',
        video_public: true,
        commentbox_visible: true
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
    ...mapState({
      isInfoLocationBottom: (state) =>
        state.Companies.video_info_location === 'bottom',

      fieldsRestr: (store) => store.FieldRestr.categories.comments
    }),
    tags() {
      return this.form.video_tag.split(', ')
    },

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
    },
    multilineText() {
      return this.form.video_description
    }
  },
  components: {
    Comment,
    VideoPlayer
  },
  created() {
    const {uuid = null} = this.$route.params
    this.active_video_uuid = uuid
    this.$store
      .dispatch('LOAD_VIDEO_INFO_BY_UUID', this.active_video_uuid)
      .then(
        (res) => {
          this.videoHasUrl = true
          this.form = {...this.form, ...res}
          this.videoUrl = res.video_output_file
          this.$store.dispatch('LOAD_COMMENTS', this.active_video_uuid)
        },
        (err) => {
          this.$store.dispatch('MENU_NAVIGATE', '/pageNotFound')
        }
      )
  },
  mounted() {},
  methods: {
    onSubtitles() {
      this.$emit(
        'contentElementClick',
        `/videos/edit/${this.active_video_uuid}`
      )
    },
    onChangePublic(val) {
      this.$store.dispatch('UPDATE_VIDEO_PUBLIC_STATUS', {
        uuid: this.form.video_uuid,
        value: val
      })
    },
    addComment() {
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }
      this.comment_sending = true
      this.$store
        .dispatch('ADD_COMMENT', {
          uuid: this.form.video_uuid,
          text: this.mnComment.comment_text
        })
        .then(
          (res) => {},
          (err) => {}
        )
        .finally(() => {
          this.mnComment.comment_text = ''
          this.comment_sending = false
        })
    },
    onPlayerEvent(_event) {
      this.$store.dispatch('ADD_PLAYER_EVENT', {
        uuid: this.form.video_uuid,
        event_data: _event
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

.value {
  font-size: 0.9rem;
  color: $link;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.next-position {
  width: 20rem;
  margin-left: 10px;
  padding-top: 0;
}
.comment-table {
  display: flex;
  min-width: 100%;
  flex-direction: column;
  //height: 300px;
  overflow-y: auto;
  -webkit-overflow-y: auto;
  //overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.video-title {
  font-weight: 400;
  line-height: 2.4rem;
  font-size: 1.4em;
  color: $link-active;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.video-content-zone {
  display: flex;
  justify-content: flex-start;
}

.video-tags {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5rem;
}

.comment-input {
  //margin: 10px 0;
  padding-top: 1rem;
  padding-bottom: 1.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  .comment-text-group {
    width: 100%;
    height: 45px;
    //border: 1px solid $link;
    //padding: 10px;
    //border-radius: 5px;
  }
  button {
    margin-left: 10px;
  }
}

@media screen and (max-width: 610px) {
  .next-position {
    margin-left: 0;
    padding-top: 10px;
  }
  .video-content-zone {
    flex-wrap: wrap;
  }
  .video-information {
    align-self: stretch;
    min-width: 100%;
  }
}

@media screen and (max-width: 875px) and (min-width: 610px) {
  .next-position {
    margin-left: 0;
    padding-top: 10px;
  }
  .video-content-zone {
    flex-wrap: wrap;
  }
  .video-information {
    align-self: stretch;
    min-width: 100%;
  }
}
</style>
