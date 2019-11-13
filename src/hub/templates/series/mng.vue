<template>
  <div class="series-operation">
    <template v-if="seriesNotFound">
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
        <div class="series-oper-id-data">
          <p>{{$t('series.id')}}:</p>
          <p>{{ `g_${mnSeries.gid}` }}</p>
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
            {{ `${$t('label.register')}` }}
          </button>
        </div>
      </div>
      <template v-if="oper === 'edit' && !series_is_deleted">
        <TableUsersLite
          :gid="mnSeries.gid"
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
import TableUsersLite from '@/components/elements/table-users-lite'

export default {
  name: 'series-mng-form',
  components: {
    TableUsersLite
  },
  props: {
    oper: String
  },
  data() {
    return {
      src_name: '',
      mnSeries: {
        name: '',
        gid: null,
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
      const oper_type = this.oper === 'edit' ? 'GROUP_UPD' : 'GROUP_ADD'
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
    const {gid = null} = this.$route.params

    this.mnSeries.gid = +gid
    const cid = this.me.profile.company_id

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_SERIES_INFO', {cid, gid}).then(
        (series) => {
          this.src_name = series.name
          this.mnSeries = {...this.mnSeries, ...series}

          const params = {
            cid,
            filter: `user_series[ol]: ARRAY[${gid}]`
          }
          this.$store
            .dispatch('LOAD_USERS', params)
            .then(() => this.$store.commit('SET_USERS_IS_LOADING', false))
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
.series-operation {
  display: flex;
  flex-direction: column;
  > p {
    font-size: 1.8em;
    font-weight: 600;
  }
  > * {
    margin-bottom: 20px;
  }
  .series-oper-id {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.2em;
    p {
      min-width: 90px;
    }
    .series-oper-id-data {
      display: flex;
      justify-content: center;
      font-size: 1.2em;
    }
  }
  input {
    margin-right: 10px;
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
