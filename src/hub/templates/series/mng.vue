<template>
  <div class="series-operation">
    <template v-if="seriesNotFound && oper !== 'add'">
      <div class="series-not-found">
        <span>Sorry. Series is not found!!!</span><br />
        <button @click="cancel_click" class="button btn-braun">
          {{ $t('label.back') }}
        </button>
      </div>
    </template>
    <template v-else>
      <p>{{ $t(series_title) }}</p>
      <div class="series-oper-id">
        <div class="series-oper-id-data" v-if="oper === 'edit'">
          <p>{{ $t('series.id') }}:</p>
          <p>{{ `s_${mnSeries.sid}` }}</p>
        </div>
        <div class="series-oper-id-data">
          <p v-if="oper === 'edit'">{{ `${$t('series.name')}` }}:</p>
          <b-form-input
            v-model="mnSeries.name"
            :placeholder="`${$t('series.series_name')}`"
            :disabled="series_is_deleted"
          ></b-form-input>
          <button
            :disabled="mnSeries.name === src_name || series_is_deleted"
            @click="save_click"
            class="button btn-blue"
          >
            {{ $t('label.register') }}
          </button>
        </div>
        <div class="series-oper-id-data">
          <b-form-group :label="`${$t('series.view_period')}:`">
            <b-form-radio
              v-model="view_period_selected"
              name="some-radios"
              value="no_limit"
              size="lg"
            >
              {{ $t('series.no_limit') }}
            </b-form-radio>
            <div class="row-series-activity-period"></div>
            <b-form-radio
              v-model="view_period_selected"
              name="some-radios"
              value="specify_period"
              size="lg"
            >
              {{ $t('series.specify_period') }}
            </b-form-radio>
            <div class="row-series-activity-period">
              <datetime
                class="datepicker"
                format="YYYY-MM-DD"
                :readonly="true"
                v-model="spec_period_activity_start"
                :disabled="!spec_period_activity"
              ></datetime>
              <p class="row-space">~</p>
              <datetime
                class="datepicker"
                format="YYYY-MM-DD"
                :readonly="true"
                v-model="spec_period_activity_finish"
                :disabled="!spec_period_activity"
              ></datetime>
            </div>
            <b-form-radio
              v-model="view_period_selected"
              name="some-radios"
              value="users_accounts"
              size="lg"
            >
              {{ $t('series.start_users_accounts') }}
            </b-form-radio>
            <div class="row-series-activity-period">
              <label>{{ $t('series.view_start') }}:</label>
              <b-form-input :id="`type-number`" :type="'number'"></b-form-input>
              <label>{{ $t('series.for_registration_date') }}</label>
            </div>
            <div class="row-series-activity-period">
              <label>{{ $t('series.view_end') }}:</label>
              <b-form-input :id="`type-number`" :type="'number'"></b-form-input>
              <label>{{ $t('series.for_registration_date') }}</label>
            </div>
          </b-form-group>
        </div>
      </div>
      <template v-if="oper === 'edit' && !series_is_deleted">
        <TableGroupsLite
          :sid="mnSeries.sid"
          @contentElementClick="contentElementClick"
        />
        <TableVideosLite
          :sid="mnSeries.sid"
          @contentElementClick="contentElementClick"
        />
      </template>
      <template v-else-if="oper === 'add'"> </template>
      <div class="series-operation-button-zone">
        <button @click="cancel_click" class="button btn-braun">
          {{ `${$t('label.cancel')}` }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import TableGroupsLite from '@/components/elements/table-groups-lite'
import TableVideosLite from '@/components/elements/table-videos-lite'
import datetime from '@/components/elements/datetimepicker'

export default {
  name: 'series-mng-form',
  components: {
    TableGroupsLite,
    TableVideosLite,
    datetime
  },
  props: {
    oper: String
  },
  data() {
    return {
      src_name: '',
      spec_period_activity: false,
      spec_period_activity_start: '',
      spec_period_activity_finish: '',
      user_period_activity: false,
      user_period_activity_start: '',
      user_period_activity_finish: '',
      view_period_selected: 'no_limit',
      mnSeries: {
        name: '',
        sid: null,
        deleted_at: ''
      },
      seriesNotFound: false
    }
  },
  methods: {
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    cancel_click() {
      this.contentElementClick('/hub/series')
    },
    save_click() {
      const oper_type = this.oper === 'edit' ? 'SERIES_UPD' : 'SERIES_ADD'
      this.$store.dispatch(oper_type, this.mnSeries).then(
        (res) => {
          this.contentElementClick('/hub/series')
        },
        (err) => {
          console.log('err=', err)
        }
      )
    }
  },

  created() {
    const {sid = null} = this.$route.params

    this.mnSeries.sid = +sid
    const cid = this.me.profile.company_id

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_SERIES_INFO', {cid, sid}).then(
        (series) => {
          this.src_name = series.name
          this.mnSeries = {...this.mnSeries, ...series}

          const params = {
            cid,
            filter: `group_series[ol]: ARRAY[${sid}]`
          }
          this.$store
            .dispatch('LOAD_GROUPS', params)
            .then(() => this.$store.commit('SET_GROUPS_IS_LOADING', false))

          const vparams = {
            cid,
            filter: `video_series[ol]: ARRAY[${sid}]`
          }
          this.$store
            .dispatch('LOAD_VIDEOS_BY_SERIES', vparams)
            .then(() => this.$store.commit('SET_STATUS_VIDEOS_LOADING', false))            
        },
        (error) => {
          this.seriesNotFound = true
          return
        }
      )
    }
  },
  computed: {
    ...mapGetters(['userMenuActiveItem', 'me']),
    series_title() {
      return `series.oper_title_${this.oper}`
    },
    series_is_deleted() {
      return Boolean(this.mnSeries.deleted_at)
    }
  }
}
</script>

<style lang="scss">
.row-series-activity-period {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;

  input {
    width: 80px;
    margin-left: 10px;
  }
  label {
    margin-left: 10px;
    font-size: 1.1rem;
    margin-bottom: 0px;
  }
}
.datepicker {
  height: 40px;
  width: 100%;
  margin-bottom: 10px;
}
p.row-space {
  padding: 0 10px;
}
.series-operation {
  display: flex;
  flex-direction: column;
  > p {
    font-size: 1.7em;
    font-weight: 600;
  }
  > * {
    //margin-bottom: 20px;
  }
  .series-oper-id {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.2em;
    .series-oper-id-data {
      display: flex;
      justify-content: center;
      font-size: 1.1em;
      > p {
        min-width: 90px;
      }
      button{
        margin-left: 10px;
      }
    }
  }
  input {
    //margin-right: 10px;
    max-width: 400px;
  }
  .check-admin {
    display: flex;
    justify-content: space-between;
    max-width: 400px;

    > * {
      margin-right: 10px;
    }
  }
  .series-operation-button-zone {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;

    .button {
      margin-right: 10px;
    }
  }
}
.series-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
