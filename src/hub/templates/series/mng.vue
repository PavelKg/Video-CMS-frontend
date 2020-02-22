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
      <span>{{ $t(series_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <b-form-group
            v-if="oper === 'edit'"
            id="input-series-id"
            :label="`${$t('series.id')}:`"
            label-cols="2"
            label-cols-sm="3"
            label-cols-lg="3"
          >
            <div class="pt-2">
              <strong>{{ `s_${mnSeries.sid}` }}</strong>
            </div>
          </b-form-group>
          <b-form-group
            :label="`${$t('series.name')}:`"
            label-cols="auto"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="input-series-name"
            align-h="between"
            :invalid-feedback="validateErrorMessage('name')"
            :state="validateState('name')"
            ><b-row>
              <b-col>
                <b-form-input
                  id="input-series-name"
                  :value="mnSeries.name"
                  :placeholder="`${$t('series.series_name')}`"
                  :disabled="series_is_deleted"
                  :maxLength="fieldsRestr.name.max_length"
                  @input.native="
                    (e) => {
                      e.target.value = e.target.value.substring(
                        0,
                        fieldsRestr.name.max_length
                      )
                      mnSeries.name = e.target.value
                    }
                  "
                ></b-form-input>
              </b-col>
              <b-col class="pt-2" cols="auto">
                <b-form-checkbox
                  class="chechbox-private"
                  id="checkbox-private"
                  v-model="mnSeries.is_private"
                  name="checkbox-private"
                  value="true"
                  unchecked-value="false"
                >
                  {{ $t('series.private') }}
                </b-form-checkbox>
              </b-col>
            </b-row>
          </b-form-group>

          <b-form-group
            :label="`${$t('series.description')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="text-series-description"
          >
            <b-form-textarea
              id="text-series-description"
              v-model="mnSeries.description"
              :placeholder="$t('label.enter_series_description')"
            ></b-form-textarea
          ></b-form-group>
          <b-form-group
            :label="`${$t('series.tag')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="input-series-tag"
            ><b-form-input
              id="input-series-tag"
              v-model="mnSeries.tags"
              :placeholder="`${$t('series.tag')}`"
              :disabled="series_is_deleted"
            ></b-form-input
          ></b-form-group>
          <b-form-group
            :label="`${$t('series.view_period')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
          >
            <b-form-radio
              v-model="mnSeries.period_type"
              name="some-radios"
              value="null"
            >
              {{ $t('series.no_limit') }}
            </b-form-radio>
            <b-form-radio
              v-model="mnSeries.period_type"
              name="some-radios"
              value="spec_period"
            >
              {{ $t('series.specify_period') }}
            </b-form-radio>
            <b-form-group>
              <b-row>
                <b-col>
                  <datetime
                    class="datepicker"
                    format="YYYY-MM-DD"
                    :readonly="true"
                    v-model="spec_period_activity_start"
                    :disabled="mnSeries.period_type !== 'spec_period'"
                  ></datetime>
                </b-col>
                <b-col cols="0" class="pt-2 px-0">
                  <span>~</span>
                </b-col>
                <b-col>
                  <datetime
                    class="datepicker"
                    format="YYYY-MM-DD"
                    :readonly="true"
                    v-model="spec_period_activity_finish"
                    :disabled="mnSeries.period_type !== 'spec_period'"
                  ></datetime
                ></b-col>
              </b-row>
            </b-form-group>

            <b-form-radio
              v-model="mnSeries.period_type"
              name="some-radios"
              value="user_reg"
            >
              {{ $t('series.start_users_accounts') }}
            </b-form-radio>
            <b-form-group :label="`${$t('series.view_start')}:`" label-cols="4"
              ><b-row>
                <b-col class="pr-0" cols="3">
                  <b-form-input
                    :id="`type-number-start`"
                    :type="'number'"
                    :disabled="mnSeries.period_type !== 'user_reg'"
                    v-model="user_period_activity_start"
                  >
                  </b-form-input>
                </b-col>
                <b-col cols="auto" class="pt-2">
                  <span>{{ $t('series.for_registration_date') }}</span>
                </b-col></b-row
              >
            </b-form-group>
            <b-form-group :label="`${$t('series.view_end')}:`" label-cols="4">
              <b-row
                ><b-col class="pr-0" cols="3">
                  <b-form-input
                    :id="`type-number-end`"
                    :type="'number'"
                    :disabled="mnSeries.period_type !== 'user_reg'"
                    v-model="user_period_activity_finish"
                  ></b-form-input></b-col
                ><b-col cols="auto" class="pt-2">
                  <span>{{ $t('series.for_registration_date') }}</span>
                </b-col></b-row
              >
            </b-form-group>
          </b-form-group>

          <template v-if="oper === 'edit'">
            <b-row align-v="center" class="pb-5" align-h="around">
              <b-col>
                <span
                  >{{ `${$t('message.number_of_registered_groups')}: `
                  }}<strong>{{ registered_groups }}</strong>
                </span>
              </b-col>
              <b-col cols="auto">
                <button
                  :disabled="series_is_deleted"
                  class="button btn-blue"
                  @click.stop.prevent="onOpenModalGroups"
                  close-only
                >
                  {{ $t('label.add_new_groups') }}
                </button>
              </b-col>
            </b-row>

            <b-modal
              v-model="modalGroupsBindingShow"
              scrollable
              :title="$t('series.modal_title_groups_list')"
              size="xl"
              centered
              ok-only
            >
              <BindingTable
                :binding_data="binding_group_data"
                v-model="groupMembersState"
              ></BindingTable>
            </b-modal>

            <template v-if="!series_is_deleted">
              <b-row
                ><b-col cols="auto">
                  <span
                    >{{ `${$t('message.number_of_registered_videos')}: `
                    }}<strong>{{ registered_videos }}</strong>
                  </span>
                </b-col>
              </b-row>
              <b-row
                ><b-col>
                  <BindingTable
                    :binding_data="binding_video_data"
                    v-model="videoMembersState"
                  ></BindingTable>
                </b-col>
              </b-row>
            </template>
          </template>
          <div class="series-operation-button-zone">
            <button
              :disabled="notChanged || series_is_deleted"
              type="submit"
              class="button btn-blue"
            >
              {{ $t('label.register') }}
            </button>
            <button @click="cancel_click" class="button btn-braun">
              {{ `${$t('label.cancel')}` }}
            </button>
          </div>
        </b-container>
      </b-form>
    </template>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import valid_mix from '@/mixins/validation'
import datetime from '@/components/elements/datetimepicker'
import BindingTable from '@/components/elements/table-binding'

export default {
  name: 'series-mng-form',
  mixins: [valid_mix],
  components: {
    datetime,
    BindingTable
  },
  props: {
    oper: String
  },
  data() {
    return {
      nameUniqError: '',
      src: {
        name: '',
        period_type: null,
        activity_start: '',
        activity_finish: '',
        is_private: false,
        description: '',
        tags: ''
      },
      spec_period_activity_start: '',
      spec_period_activity_finish: '',
      user_period_activity_start: '',
      user_period_activity_finish: '',

      mnSeries: {
        name: '',
        sid: null,
        deleted_at: '',
        period_type: null,
        is_private: false,
        description: '',
        tags: ''
      },
      seriesNotFound: false,
      binding_group_data: [],
      binding_video_data: [],
      videoMembersState: [],
      groupMembersState: [],
      modalGroupsBindingShow: false
    }
  },
  validations() {
    return {
      mnSeries: {
        name: {
          required: this.vRequired(),
          minLength: this.vMinLength(this.fieldsRestr.name.min_length),
          maxLength: this.vMaxLength(this.fieldsRestr.name.max_length),
          isUnique: this.vIsUnique(this.nameUniqError)
        }
      }
    }
  },
  watch: {
    ['mnSeries.name'](newVal) {
      if (this.nameUniqError !== '') {
        this.nameUniqError = ''
      }
    }
  },
  methods: {
    validateState(name) {
      const {$dirty, $error} = this.$v.mnSeries[name]
      return $dirty ? ($error ? !$error : null) : null
    },
    validateErrorMessage(name) {
      let message = ''
      const {$params} = this.$v.mnSeries[name]

      Object.keys($params).forEach((param) => {
        if (!this.$v.mnSeries[name][param]) {
          message += this.$v.mnSeries[name].$params[param].msg
        }
      })
      return message
    },
    onOpenModalGroups() {
      const {sid} = this.mnSeries
      this.modalGroupsBindingShow = true
    },
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },

    cancel_click() {
      this.contentElementClick('/hub/series')
    },
    onSubmit() {
      this.$v.mnSeries.$touch()
      if (this.$v.mnSeries.$anyError) {
        return
      }
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
          const errMess = err.message.replace('Error: ', '')
          switch (errMess) {
            case 'THIS_SERIES_NAME_IS_NOT_ALLOWED':
              this.nameUniqError = errMess
              break
            default:
              console.log('error=', errMess)
              break
          }
        }
      )
      if (this.oper === 'edit') {
        this.groupsModify()
        this.videosModify()
      }
    },
    groupsModify() {
      const forRemove = this.groupMembersState
        .filter((group) => {
          return group.list === 'removed'
        })
        .map((group) => {
          return group.id
        })
      const multi_oper = this.$store.dispatch('GROUP_SERIES_MULTI_OPER', {
        gid_list: forRemove,
        sid: this.mnSeries.sid,
        oper: 'del'
      })

      const forAdd = this.groupMembersState
        .filter((group) => {
          return group.list === 'added'
        })
        .map((group) => {
          return group.id
        })

      this.$store.dispatch('GROUP_SERIES_MULTI_OPER', {
        gid_list: forAdd,
        sid: this.mnSeries.sid,
        oper: 'add'
      })
    },
    videosModify() {
      const forRemove = this.videoMembersState
        .filter((video) => {
          return video.list === 'removed'
        })
        .map((video) => {
          return video.uuid
        })
      const multi_oper = this.$store.dispatch('VIDEO_SERIES_MULTI_OPER', {
        uuid_list: forRemove,
        sid: this.mnSeries.sid,
        oper: 'del'
      })

      const forAdd = this.videoMembersState
        .filter((video) => {
          return video.list === 'added'
        })
        .map((video) => {
          return video.uuid
        })

      this.$store.dispatch('VIDEO_SERIES_MULTI_OPER', {
        uuid_list: forAdd,
        sid: this.mnSeries.sid,
        oper: 'add'
      })
    },

    makeNull(val) {
      return val === '' ? null : val
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
            activity_finish: series.activity_finish,
            is_private: series.is_private,
            description: series.description || '',
            tags: series.tags || ''
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
          //this.updateGroupsLiteTable()
          //this.updateVideosLiteTable()
        },
        (error) => {
          this.seriesNotFound = true
          return
        }
      )
      this.binding_video_data = []
      this.$store.dispatch('VIDEO_BIND_SERIES', {sid}).then((res) => {
        this.binding_video_data = res
          .filter((item) => {
            return !item.deleted_at || (item.deleted_at && item.binded)
          })
          .map((item) => {
            return {
              id: item.video_id,
              uuid: item.uuid,
              name: item.name,
              category: 'videos',
              binded: item.binded
            }
          })
      })

      this.binding_group_data = []
      this.$store.dispatch('GROUP_BIND_SERIES', {sid}).then((res) => {
        this.binding_group_data = res
          .filter((item) => {
            return (!item.deleted_at && !item.binded) || item.binded
          })
          .map((item) => {
            return {
              id: item.gid,
              name: item.name,
              category: 'groups',
              binded: item.binded
            }
          })
      })
    }
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id,
      fieldsRestr: (store) => store.FieldRestr.categories.series
    }),
    registered_groups() {
      return this.binding_group_data.reduce(function(accum, item) {
        const i = item.binded ? 1 : 0
        return (accum += i)
      }, 0)
    },
    registered_videos() {
      return this.binding_video_data.reduce(function(accum, item) {
        const i = item.binded ? 1 : 0
        return (accum += i)
      }, 0)
    },

    series_title() {
      return `series.oper_title_${this.oper}`
    },
    series_is_deleted() {
      return Boolean(this.mnSeries.deleted_at)
    },
    notChanged() {
      const {name, period_type, is_private, description, tags} = this.mnSeries
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
      const curr = {
        name,
        period_type,
        activity_start,
        activity_finish,
        is_private,
        description,
        tags
      }

      return (
        JSON.stringify(this.src) === JSON.stringify(curr) &&
        this.videoMembersState.length === 0 &&
        this.groupMembersState.length === 0
      )
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/styles';

.ml-n2 {
  margin-left: -2rem !important;
}

// .group-mng-row {
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   margin: 10px 0;
//   span {
//     padding-right: 10px;
//   }
// }

// .row-series-activity-period {
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   margin: 10px 0;
//   margin-left: 10px;

//   > input {
//     width: 80px;
//     margin: 0 10px;
//   }
//   p {
//     min-width: 82px;
//     font-size: 1.1rem;
//     margin-bottom: 0px;
//   }
//   &.disabled {
//     p {
//       color: $text-disabled;
//     }
//   }
// }
// .datepicker {
//   height: 40px;
//   width: 100%;
//   margin-bottom: 10px;
// }
// p.row-space {
//   padding: 0 10px;
//   min-width: 0;
// }
.series-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }
}
//   > * {
//     //margin-bottom: 20px;
//   }
//   .series-oper-id {
//     //display: flex;
//     //flex-direction: column;
//     //align-items: flex-start;
//     //justify-content: center;
//     //font-size: 1.1em;
//     //max-width: 970px;
//     .series-oper-id-data {
//       display: flex;
//       justify-content: flex-start;
//       padding-bottom: 10px;
//       flex-wrap: nowrap;
//       align-items: center;
//       min-width: 10rem;
//       > p {
//         min-width: 110px;
//         font-size: 1.1em;
//       }
//       .chechbox-private {
//         margin-left: 15px;
//         display: flex;
//         align-items: center;
//       }
//     }
//   }
//   input {
//     //margin-right: 10px;
//     max-width: 400px;
//   }
//   textarea {
//     max-width: 400px;
//   }
//   .check-admin {
//     display: flex;
//     justify-content: space-between;
//     max-width: 400px;

//     > * {
//       margin-right: 10px;
//     }
//   }
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
// }
.series-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
