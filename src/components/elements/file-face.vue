<template>
  <div class="box-item">
    <div
      class="box-item-content"
      :class="[
        fileitem.video_thumbnail == undefined ? '' : '',
        !videoIsReady || !isActAllow('player') ? 'not-active' : 'active'
      ]"
      @click="playVideo"
    >
      <template v-if="!videoIsReady && fileitem.video_status">
        <b-container class="video-progress">
          <b-row class="justify-content-md-center" align-h="center">
            <b-col cols="1" class="progress-text" align-self="center">
              <b-spinner variant="success"></b-spinner>
              <span>{{ $t(`videos.act_in_${fileitem.video_status}`) }} ...</span>
            </b-col>
          </b-row>
        </b-container>
      </template>
      <template v-else>
        <b-container class="video-progress">
          <b-icon icon="arrow-up"></b-icon>
        </b-container>
      </template>
      <!--img :src="img_path" /-->

      <IconBase
        class="file_status"
        :icon-name="face_public ? $t('label.public') : $t('label.private')"
        :icon-color="face_public ? 'green' : '#F15B52'"
      >
        <template v-if="face_public">
          <IconLockOpen />
        </template>
        <template v-else>
          <IconLockClose />
        </template>
      </IconBase>
    </div>
    <div class="file-box-mng-panel">
      <div class="mng-panel-top">
        <b-icon icon="arrow-up"></b-icon>
        <b-form-checkbox @change="onCheckChange" :checked="isSelected" :id="tag" :name="tag"></b-form-checkbox>
        <span :title="`${title}: ${description}`">{{ title }}</span>
        <template v-if="isActAllow('edit')">
          <img @click="onEdit()" class="subtitles-svg" src="@/assets/images/subtitles.svg" />
        </template>
      </div>
      <div class="mng-panel-bottom" :class="{gray: fileitem.updated_at === ''}">
        <span v-if="fileitem.updated_at !== ''">
          {{
          `${$t('videos.last_modified')}: ${updated_at}`
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import IconBase from '../IconBase.vue'
import IconLockClose from '../icons/IconLock'
import IconLockOpen from '../icons/IconLockOpen'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'file-face-box',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'files',
      fileitem: {
        file_uuid: '',
        file_thumbnail: undefined,
        file_title: '',
        file_description: '',
        file_public: '',
        file_status: undefined,
        file_type: '',
        updated_at: ''
      }
    }
  },
  props: {
    face_uuid: String,
    face_public: Boolean
  },
  created() {
    this.fileitem.file_uuid = this.face_uuid
    this.$store.dispatch('LOAD_FILE_THUMBNAIL', this.fileitem.file_uuid).then(
      (res) => {
        this.fileitem.file_thumbnail = res.file_thumbnail
      },
      (error) => {}
    )
    this.$store
      .dispatch('LOAD_FILE_INFO_BY_UUID', this.fileitem.file_uuid)
      .then(
        (res) => {
          this.fileitem = {...this.fileitem, ...res}
        },
        (error) => {}
      )
  },
  updated() {},
  methods: {
    playVideo() {
      if (this.fileitem.file_status === 'ready' && this.isActAllow('player')) {
        this.$emit(
          'activateContent',
          `/videos/player/${this.fileitem.file_uuid}`
        )
      }
    },
    onEdit() {
      this.$emit('activateContent', `/file/edit/${this.fileitem.file_uuid}`)
    },
    onCheckChange(new_state) {
      const act = new_state ? 'SET' : 'UNSET'
      this.$store.commit(`${act}_FILE_SELECTED`, this.fileitem.file_uuid)
    }
  },
  computed: {
    ...mapState({files_selected: (state) => state.Files.selected}),
    videoIsReady() {
      return this.fileitem.files_status === 'ready'
    },
    description() {
      return this.fileitem.file_description
    },
    isSelected() {
      return this.files_selected.indexOf(this.fileitem.file_uuid) > -1
    },
    updated_at() {
      return this.fileitem.updated_at
        ? this.fileitem.updated_at
            //new Date(this.fileitem.updated_at)
            //  .toISOString()
            .slice(0, 19)
            .replace(/\-/gi, '/')
            .replace(/T/gi, ' ')
        : ''
    },
    title() {
      return this.fileitem.file_title
    },
    tag() {
      return `check-tag-${this.fileitem.file_uuid}`
    },
    img_path() {
      return this.fileitem.file_thumbnail !== ''
        ? this.fileitem.file_thumbnail
        : require('@/assets/images/p-streamCMS-s.png')
    }
  },
  components: {
    IconBase,
    IconLockClose,
    IconLockOpen
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';

.gray {
  background: $gray;
}

.not-active {
  img {
    opacity: 0.1;
    cursor: default;
  }
}

.active {
  img {
    cursor: pointer;
  }
}

.box-item {
  display: flex;
  flex-direction: column;
  margin: 10px;
  position: relative;

  .box-item-content {
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    width: 200px;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.07);
    img {
      align-self: center;
      padding: 5px;
      max-width: 200px;
      max-height: 140px;
    }
    &.svg {
      width: 24px;
      height: 18px;
      position: absolute;
      top: 20px;

      right: 20px;
    }

    .video-progress {
      align-items: center;
      border: 1px solid red;
      display: flex;
      height: 100%;
      justify-content: center;

      .progress-text {
        text-align: center;
        span {
          vertical-align: middle;
        }
      }
    }
  }
  .file-box-mng-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 200px;
    //background: #ddd;

    padding: 0 5px;
    .mng-panel-top {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 30px;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .subtitles-svg {
        margin-left: auto;
        cursor: pointer;
      }
    }
    .mng-panel-bottom {
      border-radius: 4px;
      min-height: 18px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 0.75em;
    }
  }
}

@media screen and (max-width: 610px) {
  .video-box-item {
    width: 100%;
    height: 350px;
    .video-box-item-content {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      img {
        max-width: 100%;
        max-height: 100%;
        height: auto;
      }
    }
    .video-box-mng-panel {
      width: 100%;
      font-size: 1.3em;
    }
  }
}

@media screen and (max-width: 875px) and (min-width: 610px) {
  .video-box-item .video-box-item-content {
    width: 100%;
  }
  .video-box-mng-panel {
    width: 100%;
    font-size: 1.2em;
  }
}
</style>
