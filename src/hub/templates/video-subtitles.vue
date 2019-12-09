<template>
  <div class="video-subtitles">
    <template v-if="videoNotFound">
      <div class="video-not-found">
        <span>Sorry. Video is not found!!!</span><br />
        <button @click="backToCatalog" class="button btn-braun">
          {{ dataUpdated ? $t('label.back') : $t('label.cancel') }}
        </button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t('label.edit_video') }}</span>
      <span>{{ $t('label.thumb_image_upload') }}</span>
      <form ref="subtitlesForm" @submit.prevent="onSubmit">
        <div class="video-subtitles-thumbnail">
          <div class="video-subtitles-thumbnail-left">
            <b-img
              v-bind="mainProps"
              :src="i_thumbnail"
              blank-color="#fff"
              thumbnail
              fluid-grow
              ref="thumb-img"
              alt="thumb_image"
            ></b-img>
            <div @click="deleteThumb" class="button btn-orange">
              {{ $t('label.delete') }}
            </div>
          </div>
          <div class="video-subtitles-thumbnail-right">
            <form ref="fileform">
              <div class="upload-files-border">
                <span>{{ $t('label.drop_file_here') }}</span>
                <span>{{ $t('label.or') }}</span>
                <button @click="onSelectFile($event)" class="button btn-grey">
                  {{ $t('label.select_file') }}
                </button>
                <input
                  type="file"
                  id="file"
                  ref="customInput"
                  class="custom-file-input"
                  accept="image/*"
                  @change="addCustomFiles($event)"
                />
              </div>
            </form>
          </div>
        </div>
        <div class="video-subtitles-inputs">
          <div class="video-subtitles-inputs-id">
            <p>{{ $t('videos.id') }}:</p>
            <p>{{ form.video_id }}</p>
          </div>
          <b-form-input
            :placeholder="`${$t('videos.video_title')}`"
            v-model="form.video_title"
          ></b-form-input>
          <b-form-input
            :placeholder="`${$t('videos.tag')}`"
            v-model="form.video_tag"
          ></b-form-input>
          <multiselect
            class="multiselect"
            v-if="!isLoadingData"
            v-model="form.video_groups"
            :items="group_options"
            :placeholder="`${$t('label.group_is_not_selected')}`"
          />
          <multiselect
            class="multiselect"
            v-if="!isLoadingData"
            v-model="form.video_series"
            :items="series_options"
            :placeholder="`${$t('label.series_is_not_selected')}`"
          />
          <b-form-textarea
            :placeholder="`${$t('videos.video_description')}`"
            v-model="form.video_description"
            wrap="hard"
          ></b-form-textarea>
        </div>
        <div class="video-subtitles-buttons">
          <button
            :disabled="isVideosInfoUpdating || dataUpdated"
            type="submit"
            class="button btn-blue"
          >
            {{ $t('label.registration') }}
          </button>
          <button @click="backToCatalog" class="button btn-braun">
            {{ dataUpdated ? $t('label.back') : $t('label.cancel') }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import multiselect from '@/components/elements/multiselect'

export default {
  name: 'video-subtitles',
  data() {
    return {
      mainProps: {width: 75, height: 75, class: 'm1'},
      dataUpdated: false,
      file: '',
      imagePreview: null,
      form: {
        video_uuid: '',
        video_thumbnail: '',
        video_title: '',
        video_tag: '',
        video_description: '',
        video_groups: [],
        video_series: []
      },
      active_video_uuid: '',
      videoNotFound: false,
      group_options: [],
      isLoadingData: true,
      series_options: []
    }
  },
  created() {
    const cid = this.cid
    this.active_video_uuid = this.$route.params.uuid
    this.$store.dispatch('LOAD_GROUPS', {cid}).then((res) => {
      this.$store.commit('SET_GROUPS_IS_LOADING', false)
      const grpo = this.groups
        .filter((item) => item.deleted_at === '')
        .map((item) => {
          return {value: item.gid, text: item.name}
        })
      this.group_options = [...this.group_options, ...grpo]
    })

    this.$store.dispatch('LOAD_SERIES', {cid}).then((res) => {
      this.$store.commit('SET_SERIES_IS_LOADING', false)
      const srso = this.series
        .filter((item) => item.deleted_at === '')
        .map((item) => {
          return {value: item.sid, text: item.name}
        })
      this.series_options = [...this.series_options, ...srso]
    })

    this.$store
      .dispatch('LOAD_VIDEO_INFO_BY_UUID', this.active_video_uuid)
      .then(
        (res) => {
          this.form = {...this.form, ...res}
          this.isLoadingData = false
          this.$store
            .dispatch('LOAD_VIDEO_THUMBNAIL', this.active_video_uuid)
            .then((res) => {
              this.form.video_thumbnail = res.video_thumbnail
            })
        },
        (error) => {
          this.isLoadingData = false
          this.videoNotFound = true
          return
        }
      )
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable()

    if (this.dragAndDropCapable) {
      ;[
        'drag',
        'dragstart',
        'dragend',
        'dragover',
        'dragenter',
        'dragleave',
        'drop'
      ].forEach(
        function(evt) {
          this.$refs.fileform.addEventListener(
            evt,
            function(e) {
              e.preventDefault()
              e.stopPropagation()
            }.bind(this),
            false
          )
        }.bind(this)
      )

      this.$refs.fileform.addEventListener(
        'drop',
        function(e) {
          this.file = e.dataTransfer.files[0]

          if (this.file) {
            if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
              let reader = new FileReader()
              reader.addEventListener(
                'load',
                function() {
                  this.form.video_thumbnail = reader.result
                }.bind(this),
                false
              )
              reader.readAsDataURL(this.file)
            }
          }
        }.bind(this)
      )
    }
  },
  components: {
    multiselect
  },
  computed: {
    //...mapGetters(['isVideosInfoUpdating', 'me', 'groups']),
    ...mapState({
      groups: (state) => state.Companies.Groups.list,
      series: (state) => state.Companies.Series.list,
      cid: (state) => state.Login.me.profile.company_id,
      isVideosInfoUpdating: (state) => state.Videos.isVideosInfoUpdating
    }),

    i_thumbnail() {
      return Boolean(this.form.video_thumbnail)
        ? this.form.video_thumbnail
        : require('@/assets/images/p-streamCMS-s.png')
    }
  },
  methods: {
    determineDragAndDropCapable() {
      var div = document.createElement('div')
      return (
        ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
        'FormData' in window &&
        'FileReader' in window
      )
    },
    deleteThumb() {
      this.file = ''
      this.form.video_thumbnail = ''
      //'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    },
    onSelectFile(evt) {
      evt.preventDefault()
      this.$refs.customInput.click()
    },
    backToCatalog(evt) {
      evt.preventDefault()
      Object.keys(this.form).forEach((key) => {
        this.form[key] = ''
      })
      this.$emit('contentElementClick', '/hub/videos')
    },
    onButtonReg(evt) {
      evt.preventDefault()
      this.$refs['subtitlesForm'].onSubmit
    },
    onSubmit(evt) {
      evt.preventDefault()
      // const {
      //   video_uuid,
      //   video_thumbnail,
      //   video_title,
      //   video_tag,
      //   video_description,
      //   video_groups
      // } = this.form

      this.$store.dispatch('UPDATE_VIDEO_INFO', this.form).then((res) => {
        this.$store.dispatch('LOAD_VIDEO_LIST')
        this.dataUpdated = true
      })
    },
    addCustomFiles(evt) {
      evt.preventDefault()

      this.file = event.target.files[0]
      if (this.file) {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          let reader = new FileReader()

          reader.addEventListener(
            'load',
            function() {
              this.form.video_thumbnail = reader.result
            }.bind(this),
            false
          )
          reader.readAsDataURL(this.file)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.video-subtitles {
  display: flex;
  flex-direction: column;
  max-width: 450px;
  > span {
    padding: 10px 0;
    font-size: 20px;
    font-weight: 600;
  }
  .video-subtitles-thumbnail {
    display: flex;
    .video-subtitles-thumbnail-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 150px;
      img {
        height: 150px;
      }
      .button {
        margin-top: 10px;
      }
    }
    .video-subtitles-thumbnail-right {
      margin-left: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 280px;
      height: 200px;
      background: #ededed;
      form {
        width: 90%;
        height: 90%;
        .upload-files-border {
          border: 1px dashed #000;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 30px;
          height: 100%;
          > span {
            font-size: 20px;
            margin-bottom: 10px;
          }
        }
        .custom-file-input {
          display: none;
        }
      }
    }
  }
  .video-subtitles-inputs {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    .video-subtitles-inputs-id {
      display: flex;
      p {
        min-width: 30px;
        font-weight: 600;
      }
    }
    input {
      margin-bottom: 10px;
      padding-left: 5px;
    }
    .multiselect {
      padding-bottom: 10px;
    }
  }
  .video-subtitles-buttons {
    display: flex;
    padding: 10px 0;
    > *.button {
      margin-right: 10px;
    }
  }
}

.video-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
