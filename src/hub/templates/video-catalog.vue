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
      <select class="data-select">
        <option disabled value>Year</option>
        <option v-for="item in years" :key="item">{{ item }}</option>
      </select>
      <select class="data-select">
        <option disabled value>Month</option>
        <option v-for="item in months" :key="item">{{ item }}</option>
      </select>
      <div class="data-dev">~</div>
      <select class="data-select">
        <option disabled value>Year</option>
        <option v-for="item in years" :key="item">{{ item }}</option>
      </select>
      <select class="data-select">
        <option disabled value>Month</option>
        <option v-for="item in months" :key="item">{{ item }}</option>
      </select>
    </div>
    <div class="video-box">
      <videoPrev
        v-for="vItem in video_list"
        :key="vItem.tag"
        :videoitem="vItem"
        v-on:activateContent="activateContent"
      ></videoPrev>
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
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]
    }
  },
  methods: {
    placeholder: () => $t('message.key_search'),
    activateContent(key) {
      this.$emit('contentElementClick', key)
    },
    add_new_video() {
      this.$emit('contentElementClick', 'root.subItems.videos.subItems.video_upload')
    }
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
  height: 20px;
  display: flex;
  flex-direction: row;
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
  height: 400px;
  overflow: auto;
  align-content: flex-start;
}
</style>
