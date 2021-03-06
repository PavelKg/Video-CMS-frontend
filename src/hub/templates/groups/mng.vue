<template>
  <div class="group-operation">
    <template v-if="groupNotFound">
      <div class="group-not-found">
        <span>Sorry. Group is not found!!!</span>
        <br />
        <button @click="cancel_click" class="button btn-braun">{{ $t('label.back') }}</button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t(group_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <template v-if="oper === 'edit'">
            <b-form-group id="input-group-id">
              <b-row ml="0" align-v="start" align-h="around">
                <b-col>
                  <span>{{ $t('groups.id') }}: {{ `g_${mnGroup.gid}` }}</span>
                </b-col>
              </b-row>
            </b-form-group>
          </template>

          <b-form-group
            id="input-group-name"
            :maxLength="fieldsRestr.name.maxLength"
            :label="`${$t('groups.name')}:`"
            label-cols-sm="2"
            label-cols-lg="2"
            label-for="group-name"
            :invalid-feedback="validateErrorMessage('name')"
            :state="validateState('name')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="group-name"
                  :value="mnGroup.name"
                  :placeholder="`${$t('groups.group_name')}`"
                  :disabled="group_is_deleted"
                  :state="validateState('name')"
                  @input.native="
                    (e) => {
                      e.target.value = e.target.value.substring(
                        0,
                        fieldsRestr.name.maxLength
                      )
                      mnGroup.name = e.target.value
                    }
                  "
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group
            id="input-group-parent"
            :label="`${$t('groups.parent')}:`"
            label-cols-sm="2"
            label-cols-lg="2"
            label-for="group-parent"
            :invalid-feedback="validateErrorMessage('parent')"
            :state="validateState('parent')"
          >
            <b-row>
              <b-col>
                <b-form-select
                  id="group-parent"
                  v-model="mnGroup.parent"
                  :options="parent_options"
                  :state="validateState('parent')"
                >
                  <template slot="first">
                    <option :value="null">
                      {{
                      `${$t('label.parent_is_not_selected')}`
                      }}
                    </option>
                  </template>
                </b-form-select>
              </b-col>
            </b-row>
          </b-form-group>
          <template v-if="oper === 'edit'">
            <b-form-group
              id="input-group-series"
              :label="`${$t('groups.series')}:`"
              label-cols-sm="2"
              label-cols-lg="2"
              label-for="group-name"
            >
              <b-row>
                <b-col>
                  <multiselect
                    class="multiselect"
                    v-if="!isLoadingData"
                    v-model="mnGroup.group_series"
                    :items="series_options"
                    :placeholder="`${$t('label.series_is_not_selected')}`"
                  />
                </b-col>
              </b-row>
            </b-form-group>
          </template>
          <template v-if="oper === 'edit' && !group_is_deleted">
            <b-row>
              <b-col>
                <TableUsersLite :gid="mnGroup.gid" @contentElementClick="contentElementClick" />
              </b-col>
            </b-row>
          </template>

          <div class="group-operation-button-zone">
            <button
              :disabled="dataNotChanged || group_is_deleted"
              type="submit"
              class="button btn-blue"
            >{{ `${$t('label.register')}` }}</button>

            <button @click="cancel_click" class="button btn-braun">{{ `${$t('label.cancel')}` }}</button>
          </div>
        </b-container>
      </b-form>
    </template>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import multiselect from '@/components/elements/multiselect'
import TableUsersLite from '@/components/elements/table-users-lite'
import validMixin from '@/mixins/validation'

export default {
  name: 'group-mng-form',
  mixins: [validMixin],
  components: {
    TableUsersLite,
    multiselect
  },
  props: {
    oper: String
  },
  data() {
    return {
      validFormName: 'mnGroup',
      nameUniqError: '',
      src: {name: '', series: []},
      mnGroup: {
        name: '',
        gid: null,
        parent: null,
        group_series: [],
        deleted_at: ''
      },
      groupNotFound: false,
      isLoadingData: true,
      series_options: [],
      parent_options: []
    }
  },
  watch: {
    ['mnGroup.name'](newVal) {
      if (this.nameUniqError !== '') {
        this.nameUniqError = ''
      }
    }
  },
  methods: {
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    cancel_click() {
      this.contentElementClick('/groups')
    },

    onSubmit() {
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }

      const oper_type = this.oper === 'edit' ? 'GROUP_UPD' : 'GROUP_ADD'
      this.$store.dispatch(oper_type, this.mnGroup).then(
        (res) => {
          this.contentElementClick('/groups')
        },
        (err) => {
          const errMess = err.message.replace('Error: ', '')
          switch (errMess) {
            case 'THIS_GROUP_NAME_IS_NOT_ALLOWED':
              this.nameUniqError = errMess
              break
            default:
              console.log('error=', errMess)
              break
          }
        }
      )
    }
  },

  created() {
    const {gid = null} = this.$route.params

    this.mnGroup.gid = +gid
    const cid = this.cid

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_GROUP_INFO', {cid, gid}).then(
        (group) => {
          this.src.name = group.name
          this.src.series = [...group.group_series]
          this.src.parent = group.parent

          this.mnGroup = {...this.mnGroup, ...group}

          this.$store.dispatch('LOAD_SERIES', {cid}).then((res) => {
            this.$store.commit('SET_SERIES_IS_LOADING', false)
            const srso = this.series
              .filter((item) => item.deleted_at === '')
              .map((item) => {
                return {value: item.sid, text: item.name}
              })
            this.series_options = [...this.series_options, ...srso]
            this.isLoadingData = false
          })

          const params = {
            cid,
            filter: `user_groups[ol]: ARRAY[${gid}],users.deleted_at[isNull]:`
          }
          this.$store
            .dispatch('LOAD_USERS', params)
            .then(() => this.$store.commit('SET_USERS_IS_LOADING', false))
        },
        (error) => {
          this.groupNotFound = true
          return
        }
      )
    }
    this.$store
      .dispatch('LOAD_GROUP_PARENTS', {cid, gid: this.mnGroup.gid})
      .then((res) => {
        const parents = res.map((item) => {
          return {value: item.gid, text: item.name}
        })
        this.parent_options = parents
      })
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id,
      series: (store) => store.Companies.Series.list,
      fieldsRestr: (store) => store.FieldRestr.categories.groups
    }),
    group_title() {
      return `groups.oper_title_${this.oper}`
    },
    dataNotChanged() {
      const {series} = this.src
      const {parent, group_series} = this.mnGroup
      return (
        this.src.name === this.mnGroup.name &&
        this.src.parent === this.mnGroup.parent &&
        series.length === group_series.length &&
        series.sort().every(function(value, index) {
          return value === group_series.sort()[index]
        })
      )
    },
    group_is_deleted() {
      return Boolean(this.mnGroup.deleted_at)
    }
  }
}
</script>

<style lang="scss">
.multiselect {
  width: 100%;
  font-size: 0.8em;
}
.group-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }

  .group-operation-button-zone {
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
.group-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
