<template>
  <div>
    <b-table
      :items="history_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
    </b-table>
    <div class="history-mng-panel">
      <button class="button btn-blue" @click="onDownloadCsv">
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
      perPage: 15,
      currentPage: 1
    }
  },
  watch: {
    $route(newVal) {
      this.currentPage = newVal.query.page ? newVal.query.page : 1
    },
    history_list_is_loading(newVal, oldVal) {
      if (!newVal) {
        this.currentPage = this.$route.query.page ? this.$route.query.page : 1
      }
    }
  },
  computed: {
    ...mapState({
      list: (state) => state.History.list,
      history_list_is_loading: (state) => state.History.isListLoading
    }),
    history_count() {
      return this.list ? this.list.length : 0
    },
    history_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.list.slice(begin, end)
    }
  },
  methods: {
    setPage(num) {
      this.$emit('contentElementClick', `/hub/history/?page=${num}`)
    },
    onDownloadCsv() {
      const csvHeaders = 'User ID,Object,Verbs,Timestamp\n'
      const strData = this.list
        .map((e) => {
          const row = {
            uid: e.uid,
            object: e.object,
            verbs: e.action,
            timestamp: e.created_at
          }
          return Object.values(row).join(',')
        })
        .join('\n')
      const csvContent = `data:text/csv;charset=utf-8,${csvHeaders}${strData}`
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
