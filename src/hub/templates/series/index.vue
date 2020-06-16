<template>
  <div class="series-mng">
    <div class="button-zone">
      <button
        v-if="isActAllow('add')"
        class="button btn-blue"
        @click="addNewSeries"
      >
        {{ $t('series.btn_add') }}
      </button>
      <b-checkbox
        class="ml-auto pt-2"
        v-model="isShowDeleted"
        @input="loadSeriesList"
      >
        {{ $t('label.show_deleted') }}
      </b-checkbox>
    </div>
    <seriesTable
      @contentElementClick="contentElementClick"
      @onContentError="onError"
      @reloadData="loadSeriesList"
    />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import seriesTable from '@/components/elements/table-series'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'series-mng',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'series',
      isShowDeleted: false
    }
  },
  created() {
    this.loadSeriesList()
  },
  methods: {
    loadSeriesList() {
      const cid = this.cid
      const filter = !this.isShowDeleted ? 'series.deleted_at[isNull]:' : ''
      this.$store
        .dispatch('LOAD_SERIES', {cid, filter})
        .then(() => this.$store.commit('SET_SERIES_IS_LOADING', false))
    },
    addNewSeries() {
      this.contentElementClick('/series/add')
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
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id
    })
  }
}
</script>

<style lang="scss">
.button-zone {
  display: flex;
}
</style>
