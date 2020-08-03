<template>
  <div class="preview-file">
    <template v-if="!fileHasUrl">
      <div>Loading data from server...</div>
    </template>
    <template v-else>
      <div class="file-content-zone" :class="{'flex-column': isInfoLocationBottom}">
        <VideoPlayer v-if="isMediaContent " :videourl="fileUrl" @onPlayerEvent="onPlayerEvent" />
        <img v-else-if="isImageContent" :src="fileUrl" :style="{width:'100%'}" />
        <div v-else class="non-media-content">
          <embed width="100%" height="100%" :src="fileUrl" :type="form.file_type" />
        </div>
        <b-container
          fluid
          class="pb-2 pl-0 bg-default"
          :class="[!isInfoLocationBottom ? 'next-position' : 'pt-3']"
        >
          <b-row class>
            <b-col>
              <!--span>{{ $t('videos.tag') }}:</span-->
              <template v-for="tag in tags">
                <a
                  href
                  :key="tag"
                  class="font-weight-light text-decoration-none"
                  @click.prevent.stop
                >{{ `#${tag}` }}</a>
                <span class="pl-1 value" :key="`span-${tag}`"></span>
              </template>
            </b-col>
          </b-row>
          <span class="file-title">
            {{
            form.file_title || $t('videos.no_title')
            }}
          </span>
          <p v-if="1 === 2" class="title">{{ $t('videos.video_information') }}</p>
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
              <span class="text-break" :style="{'white-space': 'pre-wrap'}">
                {{
                multilineText
                }}
              </span>
            </b-col>
          </b-row>
          <template v-if="!isUser">
            <b-row class="pt-2">
              <b-col>
                <button @click="onSubtitles" class="button btn-grey">{{ $t('label.edit') }}</button>
              </b-col>
            </b-row>
          </template>

          <template v-if="!isUser">
            <b-row class="my-2 mx-0 border-bottom">
              <b-col class="py-2 px-0">
                <span class="sub-title">{{ $t('videos.public_settings') }}:</span>
                <b-form-radio-group
                  id="radio-public-set"
                  :checked="public_status"
                  @change="onChangePublic"
                  :options="options"
                  name="radio-options"
                ></b-form-radio-group>
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
            <b-form-textarea v-model="mnComment.comment_text" rows="1" max-rows="8" />
          </b-form-group>

          <button
            :disabled="comment_sending || !mnComment.comment_text === ''"
            @click="addComment"
            class="button btn-blue"
          >{{ $t('label.send') }}</button>
        </div>
        <div class="comment-table">
          <Comment
            v-for="comment in comment_list"
            :comment="comment"
            :key="comment.comment_id"
            :video_uuid="form.file_uuid"
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
  name: 'file-preview',
  mixins: [validMixin],
  data() {
    return {
      active_file_uuid: undefined,
      fileUrl: '',
      validFormName: 'mnComment',
      mnComment: {comment_text: ''},
      form: {
        file_title: '',
        updated_at: '',
        file_tag: '',
        file_descrioption: '',
        file_output_file: '',
        file_public: true,
        file_type: '',
        commentbox_visible: true
      },
      options: [
        {text: this.$t('label.public'), value: 'public'},
        {text: this.$t('label.private'), value: 'private'}
      ],
      comment_sending: false,
      fileHasUrl: false
    }
  },
  computed: {
    ...mapGetters(['comment_list', 'me']),
    ...mapState({
      isInfoLocationBottom: (state) =>
        state.Companies.video_info_location === 'bottom',

      fieldsRestr: (store) => store.FieldRestr.categories.comments
    }),
    isMediaContent() {
      return ['video', 'audio'].includes(this.content_type)
    },
    isImageContent() {
      return ['image'].includes(this.content_type)
    },
    content_type() {
      const type = this.form.file_type
      return type.split('/')[0]
    },

    tags() {
      return this.form.file_tag.split(', ')
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
      return this.form.file_public ? 'public' : 'private'
    },
    isUser() {
      return this.me.profile.irole === 'user'
    },
    multilineText() {
      return this.form.file_description
    }
  },
  components: {
    Comment,
    VideoPlayer
  },
  created() {
    const {uuid = null} = this.$route.params
    this.active_file_uuid = uuid
    this.$store.dispatch('LOAD_FILE_INFO_BY_UUID', uuid).then(
      (res) => {
        this.fileHasUrl = true
        this.form = {...this.form, ...res}
        this.fileUrl = res.file_output_file
        this.$store.dispatch('LOAD_COMMENTS', this.active_file_uuid)
      },
      (err) => {
        this.$store.dispatch('MENU_NAVIGATE', '/pageNotFound')
      }
    )
  },

  methods: {
    onSubtitles() {
      this.$emit('contentElementClick', `/files/edit/${this.active_video_uuid}`)
    },
    onChangePublic(val) {
      this.$store.dispatch('UPDATE_FILE_PUBLIC_STATUS', {
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
          uuid: this.form.file_uuid,
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
      this.$store.dispatch('ADD_FILE_PLAYER_EVENT', {
        uuid: this.form.file_uuid,
        event_data: _event
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';
.non-media-content {
  width: 100%;
  height: 75vh;
}

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
.file-content-zone {
  display: flex;
  justify-content: flex-start;
  & > img {
    width: 100%;
  }
}

.file-tags {
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
  .file-content-zone {
    flex-wrap: wrap;
  }
  .file-information {
    align-self: stretch;
    min-width: 100%;
  }
}

@media screen and (max-width: 875px) and (min-width: 610px) {
  .next-position {
    margin-left: 0;
    padding-top: 10px;
  }
  .file-content-zone {
    flex-wrap: wrap;
  }
  .file-information {
    align-self: stretch;
    min-width: 100%;
  }
}
</style>
