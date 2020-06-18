<template>
  <div class="video-catalog">
    <div class="video-catalog-title">
      <span>{{ company_name }}</span>
      <button
        v-if="isActAllow('upload')"
        @click="add_new_video"
        class="button btn-blue"
      >
        {{ $t('label.add_new') }}
      </button>
    </div>
    <div class="search-row">
      <input
        id="keywword_search"
        :placeholder="`${$t('label.keyword_search')}`"
        v-model="inputSearch"
      />
      <img src="@/assets/images/search_black.png" @click="onKeywordSearch" />
    </div>
    <div class="video-data-filter">
      <div>
        <b-form-select
          size="sm"
          v-model="period_filter.year_from"
          :options="years"
          @change="onPeriodState"
        ></b-form-select>

        <b-form-select
          size="sm"
          v-model="period_filter.month_from"
          :options="months"
          @change="onPeriodState"
        ></b-form-select>
      </div>
      <div class="data-dev">~</div>
      <div>
        <b-form-select
          size="sm"
          v-model="period_filter.year_to"
          :options="years_to"
          @change="onPeriodState"
        ></b-form-select>
        <b-form-select
          size="sm"
          v-model="period_filter.month_to"
          :options="month_to"
          @change="onPeriodState"
        ></b-form-select>
      </div>
      <div class="video-data-filter-acc">
        <b-form-radio-group
          id="btn-filer-public"
          v-model="public_selected"
          @change="onPublicState"
          :options="public_options"
          buttons
          button-variant="outline-primary"
          size="sm"
          name="btn-filer-acc"
        ></b-form-radio-group>
      </div>
    </div>
    <div class="video-box">
      <videoPrev
        :style="{opacity: isVideosListLoading ? 0.1 : 1}"
        v-for="vItem in videos_on_page"
        :key="vItem.video_uuid"
        :face_uuid="vItem.video_uuid"
        :face_public="vItem.video_public"
        v-on:activateContent="activateContent"
      ></videoPrev>
    </div>
    <div class="videos-mng-panel">
      <div v-if="isActAllow('edit')" class="admin-mng-panel">
        <span>{{ $t('label.in_page') }}:</span>
        <a href="#" id="selectAll" @click.prevent="toggleAll('selectAll')">{{
          $t('label.select_all')
        }}</a>
        <span>|</span>
        <a
          href="#"
          id="deselectAll"
          @click.prevent="toggleAll('deselectAll')"
          :class="{isDisabled: videos_selected.length === 0}"
          >{{ $t('label.deselect_all') }}</a
        >
        <button
          class="button btn-gray"
          @click="onPublicSelected"
          :disabled="!hasSelected"
        >
          {{ $t('label.public') }}
        </button>
        <button
          class="button btn-gray"
          @click="onPrivateSelected"
          :disabled="!hasSelected"
        >
          {{ $t('label.private') }}
        </button>
        <button
          class="button btn-orange"
          @click="onDelete"
          :disabled="!hasSelected || isVideosDeleting"
        >
          {{ $t('label.delete') }}
        </button>
      </div>
      <div class="videos-mng-page">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="videos_count"
          :per-page="perPage"
          align="left"
          size=""
        >
        </b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import videoPrev from '@/components/elements/video-face'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'video-catalog',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'videos',
      years: [2020, 2019, 2018, 2017, 2016],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      public_options: [
        {text: this.$t('label.all'), value: 'all'},
        {text: this.$t('label.public'), value: 'public'},
        {text: this.$t('label.private'), value: 'private'}
      ],
      public_selected: 'all',
      perPage: 8,
      period_filter: {
        year_from: 2016,
        year_to: new Date().getFullYear(),
        month_from: 1,
        month_to: 12
      },
      active_video_page: 1,
      searchReg: undefined,
      inputSearch: ''
    }
  },
  created() {
    this.$store.commit('CLEAR_VIDEO_SELECTED')
    const query = this.$route.query
    this.updateProc(query)

    // this.$store.commit('SET_VIDEO_PUBLIC', this.public_selected)
    // this.$store.commit('SET_VIDEO_PERIOD', this.period_filter)

    // this.$store.dispatch('LOAD_VIDEO_LIST').then(() => {
    //   this.active_video_page = this.$route.query.page
    //     ? this.$route.query.page
    //     : 1
    // })
  },
  mounted() {},
  methods: {
    onKeywordSearch() {
      this.searchReg = new RegExp(`${this.inputSearch}`, 'ig')
    },
    changePublicStatus(val) {
      const value = val
      const chanded = this.videos_selected.map(async (video_uuid) => {
        try {
          await this.$store.dispatch('UPDATE_VIDEO_PUBLIC_STATUS', {
            uuid: video_uuid,
            value
          })
        } catch (error) {}
      })

      Promise.all(chanded).then(() => {
        //this.$store.dispatch('LOAD_VIDEO_LIST')
        //this.onPublicState(this.public_selected)
      })
    },
    placeholder: () => $t('message.key_search'),
    activateContent(key) {
      this.$emit('contentElementClick', key)
    },
    add_new_video() {
      this.activateContent('/videos/upload')
    },
    toggleAll(action) {
      //const action = env.target['id']
      if (action === 'selectAll') {
        this.videos_on_page.forEach((element) => {
          this.$store.commit('SET_VIDEO_SELECTED', element.video_uuid)
        })
      } else {
        this.$store.commit('CLEAR_VIDEO_SELECTED')
      }
    },
    onPublicState(new_state) {
      const publicState = new_state
      const page = 1
      this.updatePageByFilters({publicState, page})
    },
    onPeriodState() {
      const {year_from, year_to, month_from, month_to} = this.period_filter
      const from = `${year_from}-${('0' + month_from).slice(-2)}`
      const to = `${year_to}-${('0' + month_to).slice(-2)}`
      this.updatePageByFilters({from, to})
    },
    onDelete() {
      this.$store.dispatch('DELETE_VIDEO').then((res) => {
        this.$store.dispatch('LOAD_VIDEO_LIST')
      })
    },
    onPrivateSelected() {
      this.changePublicStatus('private')
    },
    onPublicSelected() {
      this.changePublicStatus('public')
    },
    // onPaggin(page) {
    //   this.setPage(page)
    // },
    setPage(num) {
      const page = num
      this.updatePageByFilters({page})
    },
    updatePageByFilters(params) {
      let sendQuery = {...this.$route.query}

      if (typeof params === 'object') {
        for (let param in params) {
          sendQuery[param] = params[param]
        }
      } else {
      }
      this.toggleAll('deselectAll')
      this.$router.push({path: '/videos', query: {...sendQuery}})
    },
    updateProc(query) {
      let curr = new Date()

      for (const key in query) {
        switch (key) {
          case 'publicState':
            this.public_selected = query[key]
            break
          case 'from':
            const _date_from = query[key].split('-')
            this.period_filter.year_from = _date_from[0]
            this.period_filter.month_from = +_date_from[1]
            break
          case 'to':
            const _date_to = query[key].split('-')
            this.period_filter.year_to = _date_to[0]
            this.period_filter.month_to = +_date_to[1]
            break
          default:
            break
        }
      }

      if (!query.to) {
        this.period_filter.year_to = curr.getFullYear()
        this.period_filter.month_to = curr.getMonth() + 1
      }

      if (!query.from) {
        curr.setMonth(curr.getMonth() - 1)
        this.period_filter.year_from = curr.getFullYear()
        this.period_filter.month_from = curr.getMonth() + 1
      }

      this.$store.commit('SET_VIDEO_PUBLIC', this.public_selected)
      this.$store.commit('SET_VIDEO_PERIOD', this.period_filter)
      this.$store
        .dispatch('LOAD_VIDEO_LIST')
        .then(() => (this.active_video_page = query.page ? query.page : 1))
    }
  },
  components: {
    videoPrev
  },
  watch: {
    $route(to, from) {
      this.updateProc(to.query)
      if (to.query.page) {
        this.active_video_page = to.query.page
      }
    }
  },
  computed: {
    ...mapGetters([
      `video_list`,
      'me',
      'isVideosListLoading',
      'isVideosDeleting',
      'videos_selected'
    ]),

    currentPage() {
      return this.active_video_page
    },
    videos_count() {
      return this.queriedVideos ? this.queriedVideos.length : 0
    },
    videos_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.queriedVideos.slice(begin, end)
    },
    queriedVideos() {
      return Boolean(this.searchReg)
        ? this.video_list.filter(
            (item) =>
              item.video_title.search(this.searchReg) !== -1 ||
              item.updated_at.search(this.searchReg) !== -1
          )
        : this.video_list
    },
    hasSelected() {
      return Boolean(this.videos_selected.length)
    },
    company_name() {
      return this.me.profile.company_name
    },
    years_to() {
      const _from = this.period_filter.year_from
      return this.years.filter((year) => year >= _from)
    },
    month_to() {
      const _month_from =
        this.period_filter.year_from === this.period_filter.year_to
          ? this.period_filter.month_from
          : 1
      return this.months.filter((month) => month >= _month_from)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.video-catalog-title {
  display: flex;
  justify-content: space-between;
  margin: 0 5px;
  flex-wrap: wrap;
  span {
    font-size: 26px;
    font-weight: 700;
  }
}
.search-row {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  input {
    padding: 0 10px;
    margin: 0 5px;
  }
  img {
    width: 24px;
    height: 24px;
    cursor: pointer;
    &:hover {
      width: 26px;
      height: 26px;
    }
  }
}
.video-data-filter {
  margin-top: 15px;
  //height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
  flex-wrap: wrap;
  justify-content: flex-start;
  select {
    width: 100px;
    margin: 5px;
  }
  .video-data-filter-acc {
    margin: 5px;
  }
}
.data-dev {
  margin: 0 10px;
}
.data-select {
  margin: 0 5px;
}
.video-box {
  margin-top: 20px;
  padding: 20px 5px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
  justify-content: flex-start;
  span {
    position: absolute;
    align-self: center;
    font-size: 1.6em;
    font-weight: 600;
  }
}
.videos-mng-panel {
  display: flex;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
  justify-content: flex-start;
  .admin-mng-panel {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .button {
      margin-right: 10px;
    }
  }
  .videos-mng-page {
    display: flex;
    margin-left: auto;
    > * {
      margin-bottom: 0;
    }
  }
  a {
    padding: 0 10px;
  }
}
.isDisabled {
  //cursor: not-allowed;
  opacity: 0.5;
  cursor: unset;
}
.isDisabled > a {
  color: currentColor;
  display: inline-block; /* For IE11/ MS Edge bug */
  pointer-events: none;
  text-decoration: none;
}
</style>
