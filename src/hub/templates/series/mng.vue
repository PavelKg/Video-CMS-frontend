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
            :disabled="notChanged || series_is_deleted"
            @click="save_click"
            class="button btn-blue"
          >
            {{ $t('label.register') }}
          </button>
        </div>
        <div class="series-oper-id-data">
          <b-form-group :label="`${$t('series.view_period')}:`">
            <b-form-radio
              v-model="mnSeries.period_type"
              name="some-radios"
              value="null"
              size="lg"
            >
              {{ $t('series.no_limit') }}
            </b-form-radio>
            <div class="row-series-activity-period"></div>
            <b-form-radio
              v-model="mnSeries.period_type"
              name="some-radios"
              value="spec_period"
              size="lg"
            >
              {{ $t('series.specify_period') }}
            </b-form-radio>
            <div
              class="row-series-activity-period"
              :class="mnSeries.period_type !== 'spec_period' ? 'disabled' : ''"
            >
              <datetime
                class="datepicker"
                format="YYYY-MM-DD"
                :readonly="true"
                v-model="spec_period_activity_start"
                :disabled="mnSeries.period_type !== 'spec_period'"
              ></datetime>
              <p class="row-space">
                ~
              </p>
              <datetime
                class="datepicker"
                format="YYYY-MM-DD"
                :readonly="true"
                v-model="spec_period_activity_finish"
                :disabled="mnSeries.period_type !== 'spec_period'"
              ></datetime>
            </div>
            <b-form-radio
              v-model="mnSeries.period_type"
              name="some-radios"
              value="user_reg"
              size="lg"
            >
              {{ $t('series.start_users_accounts') }}
            </b-form-radio>
            <div
              class="row-series-activity-period"
              :class="mnSeries.period_type !== 'user_reg' ? 'disabled' : ''"
            >
              <p>{{ $t('series.view_start') }}:</p>
              <b-form-input
                :id="`type-number`"
                :type="'number'"
                :disabled="mnSeries.period_type !== 'user_reg'"
                v-model="user_period_activity_start"
              ></b-form-input>
              <p>{{ $t('series.for_registration_date') }}</p>
            </div>
            <div
              class="row-series-activity-period"
              :class="mnSeries.period_type !== 'user_reg' ? 'disabled' : ''"
            >
              <p>{{ $t('series.view_end') }}:</p>
              <b-form-input
                :id="`type-number`"
                :type="'number'"
                :disabled="mnSeries.period_type !== 'user_reg'"
                v-model="user_period_activity_finish"
              ></b-form-input>
              <p>{{ $t('series.for_registration_date') }}</p>
            </div>
          </b-form-group>
        </div>
      </div>
      <template v-if="oper === 'edit' && !series_is_deleted">
        <TableGroupsLite
          :sid="mnSeries.sid"
          @contentElementClick="contentElementClick"
          @deleteGroupSeries="deleteGroupSeries"
        />
        <TableVideosLite
          :sid="mnSeries.sid"
          @contentElementClick="contentElementClick"
          @deleteVideoSeries="deleteVideoSeries"
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
import {mapGetters, mapState} from 'vuex'
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
      src: {
        name: '',
        period_type: null,
        activity_start: '',
        activity_finish: ''
      },
      spec_period_activity_start: '',
      spec_period_activity_finish: '',
      user_period_activity_start: '',
      user_period_activity_finish: '',

      mnSeries: {
        name: '',
        sid: null,
        deleted_at: '',
        period_type: null
      },
      seriesNotFound: false
    }
  },
  methods: {
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    deleteVideoSeries(uuid) {
      const {sid} = this.mnSeries
      this.$store.dispatch('VIDEO_SERIES_DEL', {uuid, sid}).then(() => {
        this.updateVideosLiteTable()
      })
    },
    deleteGroupSeries(gid) {
      const {sid} = this.mnSeries
      this.$store.dispatch('GROUP_SERIES_DEL', {gid, sid}).then(() => {
        this.updateGroupsLiteTable()
      })
    },
    cancel_click() {
      this.contentElementClick('/hub/series')
    },
    save_click() {
      const oper_type = this.oper === 'edit' ? 'SERIES_UPD' : 'SERIES_ADD'

      this.mnSeries.period_type =
        this.mnSeries.period_type === 'null' ? null : this.mnSeries.period_type
      const per_type = this.mnSeries.period_type

      this.mnSeries.activity_start =
        per_type === null
          ? null
          : per_type === 'spec_period'
          ? this.makeNull(this.spec_period_activity_start)
          : this.makeNull(this.user_period_activity_start)

      this.mnSeries.activity_finish =
        per_type === null
          ? null
          : per_type === 'spec_period'
          ? this.makeNull(this.spec_period_activity_finish)
          : this.makeNull(this.user_period_activity_finish)

      this.$store.dispatch(oper_type, this.mnSeries).then(
        (res) => {
          this.contentElementClick('/hub/series')
        },
        (err) => {
          console.log('err=', err)
        }
      )
    },
    makeNull(val) {
      return val === '' ? null : val
    },
    updateVideosLiteTable() {
      const cid = this.cid
      const {sid} = this.mnSeries
      const vparams = {
        cid,
        filter: `video_series[ol]: ARRAY[${sid}]`
      }
      this.$store
        .dispatch('LOAD_VIDEOS_BY_SERIES', vparams)
        .then(() => this.$store.commit('SET_STATUS_VIDEOS_LOADING', false))
    },
    updateGroupsLiteTable() {
      const cid = this.cid
      const {sid} = this.mnSeries
      const params = {
        cid,
        filter: `group_series[ol]: ARRAY[${sid}]`
      }
      this.$store
        .dispatch('LOAD_GROUPS', params)
        .then(() => this.$store.commit('SET_GROUPS_IS_LOADING', false))
    }
  },

  created() {
    const {sid = null} = this.$route.params

    this.mnSeries.sid = +sid
    const cid = this.cid

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_SERIES_INFO', {cid, sid}).then(
        (series) => {
          this.src = {
            name: series.name,
            period_type: series.period_type,
            activity_start: series.activity_start,
            activity_finish: series.activity_finish
          }
          this.mnSeries = {...this.mnSeries, ...series}

          switch (this.mnSeries.period_type) {
            case 'spec_period':
              this.spec_period_activity_start = this.mnSeries.activity_start
              this.spec_period_activity_finish = this.mnSeries.activity_finish
              break
            case 'user_reg':
              this.user_period_activity_start = this.mnSeries.activity_start
              this.user_period_activity_finish = this.mnSeries.activity_finish
              break
            default:
              break
          }
          this.updateGroupsLiteTable()
          this.updateVideosLiteTable()
        },
        (error) => {
          this.seriesNotFound = true
          return
        }
      )
    }
  },
  computed: {
    ...mapState({cid: (store) => store.Login.me.profile.company_id}),
    series_title() {
      return `series.oper_title_${this.oper}`
    },
    series_is_deleted() {
      return Boolean(this.mnSeries.deleted_at)
    },
    notChanged() {
      const {name, period_type} = this.mnSeries
      const activity_start =
        period_type === 'no_limit'
          ? ''
          : period_type === 'spec_period'
          ? this.spec_period_activity_start
          : this.user_period_activity_start
      const activity_finish =
        period_type === 'no_limit'
          ? ''
          : period_type === 'spec_period'
          ? this.spec_period_activity_finish
          : this.user_period_activity_finish
      const curr = {name, period_type, activity_start, activity_finish}

      return JSON.stringify(this.src) === JSON.stringify(curr)
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/styles';

.row-series-activity-period {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
  margin-left: 10px;

  > input {
    width: 80px;
    margin: 0 10px;
  }
  p {
    min-width: 82px;
    font-size: 1.1rem;
    margin-bottom: 0px;
  }
  &.disabled {
    p {
      color: $text-disabled;
    }
  }
}
.datepicker {
  height: 40px;
  width: 100%;
  margin-bottom: 10px;
}
p.row-space {
  padding: 0 10px;
  min-width: 0;
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
      button {
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
