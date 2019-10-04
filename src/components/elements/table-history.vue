<template>
  <div>
    <b-table
      :items="[]"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
    </b-table>
    <div class="history-mng-panel">
      <button class="button btn-blue">
        {{ $t('label.csv_download') }}
      </button>
      <div class="history-mng-pag">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="history_count"
          :per-page="perPage"
          align="left"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  data() {
    return {
      fields: [
        {
          key: 'uid',
          label: this.$t('history.user_id'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'object',
          label: this.$t('history.object')
        },
        {
          key: 'action',
          label: this.$t('history.verbs')
        },
        {
          key: 'created_at',
          label: this.$t('history.timestamp')
        }
      ],
      perPage: 8,
      currentPage: 1,
      history_count: 0
    }
  },
  computed: {
    ...mapState({
      // ...
    })
  },
  methods: {
    setPage(num) {
      this.$emit('contentElementClick', `/hub/history/?page=${num}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';

.history-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .history-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
  a {
    //padding: 0 10px;
  }
}
</style>
