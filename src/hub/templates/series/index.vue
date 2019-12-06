<template>
  <div class="series-mng">
    <button class="button btn-blue" @click="addNewSeries">
      {{ $t('series.btn_add') }}
    </button>
    <seriesTable
      @contentElementClick="contentElementClick"
      @onContentError="onError"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import seriesTable from '@/components/elements/table-series'

export default {
  name: 'series-mng',
  created() {
    this.$store
      .dispatch('LOAD_SERIES', {cid: this.me.profile.company_id})
      .then(() => this.$store.commit('SET_SERIES_IS_LOADING', false))
  },
  methods: {
    addNewSeries() {
      this.contentElementClick('/hub/series_add')
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    onError(message) {
      this.$store.commit('SHOW_MESSAGE_ERROR', message)
    }
  },
  components: {
    seriesTable
  },
  computed: {
    ...mapGetters(['me'])
  }
}
</script>

<style lang="scss"></style>
