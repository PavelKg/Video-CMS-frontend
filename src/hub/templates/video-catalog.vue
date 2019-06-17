<template>
  <div class="video-catalog">
    <div class="video-catalog-title">
      <span>{{ company_name }}</span>
      <button v-if="isAdmin" @click="add_new_video" class="button btn-blue">
        {{ $t('label.add_new') }}
      </button>
    </div>
    <div class="search-row">
      <input
        id="keywword_search"
        :placeholder="`${$t('label.keyword_search')}`"
        @input="handleInput('search', $event.target.value)"
      />
      <img src="@/assets/images/search_black.png" />
    </div>
    <div class="video-data-filter">
      <div>
        <b-form-select
          size="sm"
          v-model="period_filter.selected_year_from"
          :options="years"
        ></b-form-select>
        <b-form-select
          size="sm"
          v-model="period_filter.selected_month_from"
          :options="months"
        ></b-form-select>
      </div>
      <div class="data-dev">~</div>
      <div>
        <b-form-select
          size="sm"
          v-model="period_filter.selected_year_to"
          :options="years_to"
        ></b-form-select>
        <b-form-select
          size="sm"
          v-model="period_filter.selected_month_to"
          :options="month_to"
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
    <div class="video-box" >
      <template v-if="isVideosListLoading"><span>Loading...</span></template>
      <videoPrev :style="{opacity: isVideosListLoading? 0.1: 1}"
        v-for="vItem in video_list"
        :key="vItem.tag"
        :videoitem="vItem"
        v-on:activateContent="activateContent"
      ></videoPrev>
    </div>
    <div class="videos-mng-panel">
      <div class="admin-mng-panel" v-if="isAdmin">
        <span>{{ $t('label.in_page') }}:</span>
        <a href="#" id="selectAll" @click="toggleAll">{{
          $t('label.select_all')
        }}</a>
        <span>|</span>
        <a href="#" id="deselectAll" @click="toggleAll">{{
          $t('label.deselect_all')
        }}</a>
        <button class="button btn-orange">
          {{ $t('label.delete') }}
        </button>
      </div>
      <div class="videos-mng-page">
        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          align="left"
          size="sm"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import videoPrev from '@/components/elements/video-face'

export default {
  name: 'video-catalog',
  data() {
    return {
      years: [2019, 2018, 2017, 2016],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12],
      public_options: [
        {text: this.$t('label.all'), value: 'all'},
        {text: this.$t('label.public'), value: 'public'},
        {text: this.$t('label.private'), value: 'private'}
      ],
      public_selected: 'all',
      videos_selected: [],
      perPage: 3,
      currentPage: 1,
      rows: 8,
      period_filter: {
        selected_year_from: 2016,
        selected_year_to: 2019,
        selected_month_from: 1,
        selected_month_to: 12
      }
    }
  },
  methods: {
    placeholder: () => $t('message.key_search'),
    activateContent(key) {
      this.$emit('contentElementClick', key)
    },
    add_new_video() {
      this.$emit(
        'contentElementClick',
        'root.subItems.videos.subItems.video_upload'
      )
    },
    toggleAll(env) {
      const action = env.target['id']
      if (action === 'selectAll') {
        this.video_list.forEach(element => {
          this.$store.commit('SET_VIDEO_SELECTED', element.video_uuid)
        });
      } 
      else {
        this.$store.commit('CLEAR_VIDEO_SELECTED')
            }
          
    },
    onPublicState(new_state) {
      this.$store.commit('SET_VIDEO_PUBLIC', new_state)
      this.$store.dispatch('LOAD_VIDEO_LIST')
    },
  },
  components: {
    videoPrev
  },
  computed: {
    ...mapGetters(['video_list', 'me', 'isVideosListLoading']),
    company_name() {
      return this.me.profile.company_name
    },
    isAdmin() {
      return this.me.profile.irole === 'admin'
    },
    years_to() {
      const _from = this.period_filter.selected_year_from
      return this.years.filter(year => year >= _from)
    },
    month_to() {
      const _month_from =
        this.period_filter.selected_year_from ===
        this.period_filter.selected_year_to
          ? this.period_filter.selected_month_from
          : 1
      return this.months.filter(month => month >= _month_from)
    },
    selectVideo(){
      return true //this.videos_selected.indexOf() > -1
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
  input {
    padding: 0 10px;
    margin: 0 5px;
  }
  img {
    width: 24px;
    height: 24px;
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
  //align-content: flex-end;
  justify-content: flex-start;
  span {
    position: absolute;
    align-self: center;
    font-size: 1.6em;
    font-weight: 600
  }
}
.videos-mng-panel {
  display: flex;
  align-items: center;
  margin-top: 15px;
  .admin-mng-panel {
    display: flex;
    align-items: center;
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
</style>
