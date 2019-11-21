<template>
  <div class="series-table">
    <b-table
      :items="series_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
      <template #cell(name)="row">
        <b-form-checkbox
          :id="row.item.sid.toString()"
          :name="`ch-${row.item.sid}`"
          :value="row.item.sid"
          v-model="series_selected"
          :disabled="row.item.deleted_at !== ''"
          class="truncate-text"
          >{{ row.item.name }}
        </b-form-checkbox>
      </template>
      <template #cell(mng)="item">
        <div class="mng-column">
          <template v-if="item.item.deleted_at === ''">
            <div class="icon-button">
              <img
                src="@/assets/images/edit_black.png"
                @click="editSeries(item.item)"
              />
            </div>
            <div class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delOneSeries(item.item.sid)"
              /></div
          ></template>
          <template v-else>
            {{ $t('series.tbl_deleted') }}
          </template>
        </div>
      </template>
    </b-table>
    <div class="series-mng-panel">
      <span>{{ $t('series.in_page') }}:</span>
      <a href="#" id="selectAll" @click.prevent="toggleAll">{{
        $t('label.select_all')
      }}</a>
      <span>|</span>
      <a href="#" id="deselectAll" @click.prevent="toggleAll">{{
        $t('label.deselect_all')
      }}</a>
      <button
        class="button btn-orange"
        @click="delGroupSeries"
        :disabled="series_selected.length === 0"
      >
        {{ $t('label.delete') }}
      </button>
      <div class="series-mng-pag">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="series_count"
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
  name: 'table-series',
  data() {
    return {
      fields: [
        {
          key: 'name',
          label: this.$t('series.tbl_header_name'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'mng',
          label: this.$t('series.tbl_header_mgn'),
          thStyle: {width: '120px !important', 'text-align': 'center'}
        }
      ],
      perPage: 8,
      currentPage: 1,
      series_selected: [],
      modalShow: false,
      modal_text: ''
    }
  },
  watch: {
    $route(newVal) {
      this.currentPage = newVal.query.page ? newVal.query.page : 1
    },
    series_is_loading(newVal, oldVal) {
      if (!newVal) {
        this.currentPage = this.$route.query.page ? this.$route.query.page : 1
      }
    }
  },
  methods: {
    toggleAll(env) {
      const action = env.target['id']
      this.series_selected =
        action === 'selectAll'
          ? this.series_on_page.filter((series) => series.deleted_at === '').map(series => series.sid)
          : []
      console.log('this.series_selected=', this.series_selected)
    },
    editSeries(series) {
      this.$emit('contentElementClick', `/hub/series_edit/sid/${series.sid}`)
    },
    delOneSeries(series_sid) {
      this.$store.dispatch('SERIES_DEL', series_sid).then(
        (res) => {
          this.$store
            .dispatch('LOAD_SERIES', this.cid)
            .then(() => this.$store.commit('SET_SERIES_IS_LOADING', false))
        },
        (err) => {
          this.$emit(
            'onContentError',
            `errors.${err.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      )
    },
    delGroupSeries() {
      const deleted_series = this.series_selected.map(async (series_sid) => {
        try {
          await this.$store.dispatch('SERIES_DEL', series_sid)
          const ind = this.series_selected.findIndex(
            (sid) => sid === series_sid
          )
          if (ind > -1) {
            this.series_selected.splice(ind, 1)
          }
        } catch (error) {
          console.log('error')
          this.$emit(
            'onContentError',
            `errors.${error.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      })

      Promise.all(deleted_series).then(() => {
        this.$store
          .dispatch('LOAD_SERIES', this.cid)
          .then(() => this.$store.commit('SET_SERIES_IS_LOADING', false))
      })
    },
    setPage(num) {
      this.$emit('contentElementClick', `/hub/series/?page=${num}`)
    }
  },
  computed: {
    ...mapState({
      series: (state) => state.Companies.Series.list,
      cid: (state) => state.Login.me.profile.company_id,
      series_is_loading: (state) => state.Companies.Series.isListLoading
    }),
    series_count() {
      return this.series ? this.series.length : 0
    },
    series_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.series.slice(begin, end)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.series-table {
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

.series-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .series-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 875px) {
  .series-mng-panel {
    button {
      margin-top: 15px;
    }
    .series-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
