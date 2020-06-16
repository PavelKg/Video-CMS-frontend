<template>
  <div class="video-box-item">
    <div
      class="video-box-item-content"
      :class="[
        videoitem.video_thumbnail == undefined ? 'gray' : '',
        !videoIsReady || !isActAllow('player') ? 'not-active' : 'active'
      ]"
      @click="playVideo"
    >
      <template v-if="!videoIsReady && videoitem.video_status">
        <b-container class="video-progress">
          <b-row class="justify-content-md-center" align-h="center">
            <b-col cols="10" class="progress-text" align-self="center">
              <b-spinner variant="success"></b-spinner>

              <span>
                {{ $t(`videos.act_in_${videoitem.video_status}`) }} ...</span
              >
            </b-col>
          </b-row>
        </b-container>
      </template>
      <img :src="img_path" />
      <IconBase
        class="video_status"
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
    <div class="video-box-mng-panel">
      <div class="mng-panel-top">
        <b-form-checkbox
          @change="onCheckChange"
          :checked="isSelected"
          :id="tag"
          :name="tag"
        ></b-form-checkbox>
        <span :title="`${title}: ${description}`">{{ title }}</span>
        <template v-if="isActAllow('edit')">
          <img
            @click="onEdit()"
            class="subtitles-svg"
            src="@/assets/images/subtitles.svg"
          />
        </template>
      </div>
      <div
        class="mng-panel-bottom"
        :class="{gray: videoitem.updated_at === ''}"
      >
        <span v-if="videoitem.updated_at !== ''">{{
          `${$t('videos.last_modified')}: ${updated_at}`
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import IconBase from '../IconBase.vue'
import IconLockClose from '../icons/IconLock'
import IconLockOpen from '../icons/IconLockOpen'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'video-face-box',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'videos',
      videoitem: {
        video_uuid: '',
        video_thumbnail: undefined,
        video_title: '',
        video_description: '',
        video_public: '',
        video_status: undefined,
        updated_at: ''
      }
    }
  },
  props: {
    face_uuid: String,
    face_public: Boolean
  },
  created() {
    this.videoitem.video_uuid = this.face_uuid
    this.$store
      .dispatch('LOAD_VIDEO_THUMBNAIL', this.videoitem.video_uuid)
      .then(
        (res) => {
          this.videoitem.video_thumbnail = res.video_thumbnail
        },
        (error) => {}
      )
    this.$store
      .dispatch('LOAD_VIDEO_INFO_BY_UUID', this.videoitem.video_uuid)
      .then(
        (res) => {
          this.videoitem = {...this.videoitem, ...res}
        },
        (error) => {}
      )
  },
  updated() {},
  methods: {
    playVideo() {
      if (this.videoitem.video_status === 'ready' && this.isActAllow('player')) {
        this.$emit(
          'activateContent',
          `/videos/player/${this.videoitem.video_uuid}`
        )
      }
    },
    onEdit() {
      this.$emit('activateContent', `/videos/edit/${this.videoitem.video_uuid}`)
    },
    onCheckChange(new_state) {
      const act = new_state ? 'SET' : 'UNSET'
      this.$store.commit(`${act}_VIDEO_SELECTED`, this.videoitem.video_uuid)
    }
  },
  computed: {
    ...mapGetters(['me', 'videos_selected']),
    videoIsReady() {
      return this.videoitem.video_status === 'ready'
    },
    description() {
      return this.videoitem.video_description
    },
    isSelected() {
      return this.videos_selected.indexOf(this.videoitem.video_uuid) > -1
    },
    updated_at() {
      return this.videoitem.updated_at
        ? this.videoitem.updated_at
            //new Date(this.videoitem.updated_at)
            //  .toISOString()
            .slice(0, 19)
            .replace(/\-/gi, '/')
            .replace(/T/gi, ' ')
        : ''
    },
    title() {
      return this.videoitem.video_title
    },
    tag() {
      return `check-tag-${this.videoitem.video_uuid}`
    },
    img_path() {
      return this.videoitem.video_thumbnail !== ''
        ? this.videoitem.video_thumbnail
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

.video-box-item {
  display: flex;
  flex-direction: column;
  margin: 10px;
  position: relative;

  .video-box-item-content {
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
    svg {
      width: 24px;
      height: 18px;
      position: absolute;
      top: 20px;

      right: 20px;
    }

    .video-progress {
      position: absolute;
      .progress-text {
        text-align: center;
        span {
          vertical-align: middle;
        }
      }
    }
  }
  .video-box-mng-panel {
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
