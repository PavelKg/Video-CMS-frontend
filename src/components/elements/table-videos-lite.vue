<template>
  <div class="videos-table">
    <span>
      {{ $t('message.number_of_registered_videos') }}: {{ videos_count }}
      {{ $t('label.videos') }}
    </span>
    <b-table
      :items="videos_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
      <template #cell(video_id)="row">
        <b-form-checkbox
          :id="row.item.video_id.toString()"
          :name="`ch-${row.item.video_id}`"
          :value="row.item.video_id"
          v-model="videos_selected"
          :disabled="row.item.deleted_at !== ''"
          class="truncate-text"
          ><a
            href="#"
            @click.prevent="onOpenVideoDetails(row.item.video_uuid)"
            >{{
              `${row.item.video_id} ${
                row.item.deleted_at !== '' ? ' (deleted)' : ''
              }`
            }}</a
          >
        </b-form-checkbox>
      </template>
      <template #cell(video_title)="row">
        <p class="truncate-text">{{ row.item.video_title }}</p>
      </template>
      <template #cell(mng)="item">
        <div class="mng-column">
          <template>
            <div class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delVideoSeries(item.item.video_uuid)"
              /></div
          ></template>
        </div>
      </template>
    </b-table>
    <div class="videos-mng-panel">
      <div class="videos-mng-pag">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="videos_count"
          :per-page="perPage"
          align="left"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'table-videos-lite',
  props: {sid: Number},
  data() {
    return {
      fields: [
        {
          key: 'video_id',
          label: this.$t('videos.tbl_header_id'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'video_title',
          label: this.$t('videos.tbl_header_name'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'mng',
          label: this.$t('videos.tbl_header_mgn'),
          thStyle: {width: '120px !important', 'text-align': 'center'}
        }
      ],
      perPage: 8,
      currentPage: 1,
      modalShow: false,
      modal_text: '',
      videos_selected: ''
    }
  },
  watch: {
    $route(newVal) {
      this.currentPage = newVal.query.page ? newVal.query.page : 1
    },
    videos_is_loading(newVal, oldVal) {
      if (!newVal) {
        this.currentPage = this.$route.query.page ? this.$route.query.page : 1
      }
    }
  },
  methods: {
    onOpenVideoDetails(uuid) {
      this.$emit('contentElementClick', `/hub/videos_subtitles/uuid/${uuid}`)
    },
    delVideoSeries(uuid) {
      this.$emit('deleteVideoSeries', uuid)
    },

    setPage(num) {
      this.$emit('contentElementClick', `/hub/videos/?page=${num}`)
    }
  },

  computed: {
    ...mapState({
      videos: (state) => state.Videos.videos.list,
      //cid: (state) => state.Login.me.profile.cid,
      videos_is_loading: (state) => state.Videos.videos.isListLoading
    }),
    videos_count() {
      return this.videos ? this.videos.length : 0
    },
    videos_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.videos.slice(begin, end)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.videos-table {
  padding: 10px 0;
}

.deleted_item {
  color: $link;
}

.mng-column {
  display: flex;
  justify-content: space-around;
}

.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.videos-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  flex-wrap: wrap;
  .videos-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 875px) {
  .videos-mng-panel {
    button {
      margin-top: 15px;
    }
    .videos-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
