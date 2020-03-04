<template>
  <div>
    <b-table
      :items="history_on_page"
      :fields="fields"
      :busy="history_list_is_loading"
      responsive
      striped
      hover
      head-variant="dark"
      no-local-sorting
      @sort-changed="sortingChanged"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      show-empty
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong> {{ $t('label.loading') }} </strong>
        </div>
      </template>
      <template #empty>
        <h5 align="center">{{ $t('history.no_data') }}</h5>
      </template>
    </b-table>
    <div class="history-mng-panel">
      <button
        class="button btn-blue"
        @click="onDownloadCsv"
        :disabled="history_count === 0"
      >
        {{ $t('label.csv_download') }}
      </button>
      <div class="history-mng-pag">
        <b-pagination
          v-if="!history_list_is_loading"
          v-model="currentPage"
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
          sortable: true,
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'category',
          sortable: true,
          label: this.$t('history.category'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'object',
          sortable: true,
          label: this.$t('history.object'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'action',
          sortable: true,
          label: this.$t('history.verbs'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'details',
          sortable: true,
          label: this.$t('history.details'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'created_at',
          sortable: true,
          label: this.$t('history.timestamp'),
          formatter: (value, key, item) => {
            return value.slice(0, 19)
          },
          thStyle: {'text-align': 'center'}
        }
      ],
      sortBy: 'created_at',
      sortDesc: false,
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
      history_list_is_loading: (state) => state.History.isHistoryListLoading
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
    sortingChanged(ctx) {
      const {sortBy, sortDesc} = ctx
      this.$store.commit('ORDER_HISTORY', {sortBy, sortDesc})
    },
    setPage(num) {
      const {path, query} = this.$route
      this.$router.push({path: this.$route.path, query: {...query, page: num}})
      //this.$router.push({path, query: {...query}})
      //this.$emit('contentElementClick', `/hub/history/?page=${num}`)
    },
    onDownloadCsv() {
      const csvHeaders = 'User ID,Category,Object,Verbs,Details,Timestamp\n'
      const strData = this.list
        .map((e) => {
          const row = {
            uid: e.uid,
            category: e.category,
            object: e.object,
            verbs: e.action,
            details: e.details,
            timestamp: e.created_at
          }
          return Object.values(row).join(',')
        })
        .join('\n')
      const exportedFilenmae = 'export.csv'
      const csv = `${csvHeaders}${strData}`

      const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae)
      } else {
        var link = document.createElement('a')
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', exportedFilenmae)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    }
  }
}
</script>

<style lang="scss">
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
}
</style>
