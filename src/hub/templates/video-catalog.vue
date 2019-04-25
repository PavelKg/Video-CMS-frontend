<template>
  <div class="video-catalog">
    <div class="video-catalog-title">
      <span>{{ company_name }}</span>
      <button @click="add_new_video" class="button btn-blue">
        {{ $t('label.add_new') }}
      </button>
    </div>
    <div class="search-row">
      <input
        id="keywword_search"
        placeholder="Keyword search"
        @input="handleInput('search', $event.target.value)"
      />
      <img src="@/assets/images/search_black.png" />
    </div>
    <div class="video-data-filter">
      <div>
      <b-form-select size="sm" v-model="selected" :options="years"></b-form-select>
      <b-form-select size="sm" v-model="selected" :options="months"></b-form-select>
      </div>
      <div class="data-dev">~</div>
      <div>
      <b-form-select size="sm" v-model="selected" :options="years"></b-form-select>
      <b-form-select size="sm" v-model="selected" :options="months"></b-form-select>
      </div>
      <div class="video-data-filter-acc">
        <b-form-radio-group
          id="btn-filer-acc"
          v-model="acc_selected"
          :options="acc_options"
          buttons
          button-variant="outline-primary"
          size="sm"
          name="btn-filer-acc"
        ></b-form-radio-group>
      </div>
    </div>
    <div class="video-box">
      <videoPrev
        v-for="vItem in video_list"
        :key="vItem.tag"
        :videoitem="vItem"
        v-on:activateContent="activateContent"
      ></videoPrev>
    </div>
    <div class="videos-mng-panel">
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
      acc_options: [
        {text: 'All', value: 'all'},
        {text: 'Public', value: 'public'},
        {text: 'Private', value: 'private'}
      ],
      acc_selected: 'all',
      perPage: 3,
      currentPage: 1,
      rows: 8,
      selected: []
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
    toggleAll() {}
  },
  components: {
    videoPrev
  },
  computed: {
    ...mapGetters(['video_list', 'me']),
    company_name() {
      return this.me.profile.company_name
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
  select{
    width: 100px;
    margin:5px;
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
  align-content: flex-start;
  justify-content: center;
}
.videos-mng-panel {
  display: flex;
  align-items: center;
  margin-top: 15px;
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
