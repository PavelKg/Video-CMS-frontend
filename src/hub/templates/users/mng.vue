<template>
  <div class="user-operation">
    <template v-if="userNotFound">
      <div class="user-not-found">
        <span>Sorry. User is not found!!!</span><br />
        <button @click="onCancel" class="button btn-braun">
          {{ `${$t('label.back')}` }}
        </button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t(user_title) }}</span>
      <b-form @submit.stop.prevent="onSubmit">
        <b-container class="px-0 my-3">
          <b-form-group
            id="input-group-id"
            :invalid-feedback="validateErrorMessage('uid')"
            :state="validateState('uid')"
          >
            <b-row ml="0" align-v="start" align-h="around">
              <template v-if="oper === 'edit'">
                <b-col>
                  <span>{{ `${$t('users.user_id')}` }}: {{ mnUser.uid }} </span>
                </b-col>
              </template>
              <template v-if="oper === 'add'">
                <b-col cols="8">
                  <b-form-input
                    type="text"
                    :maxLength="fieldsRestr.uid.maxLength"
                    :value="mnUser.uid"
                    :placeholder="`${$t('users.user_id')}`"
                    :state="validateState('uid')"
                    @input.native="
                      (e) => {
                        e.target.value = e.target.value.substring(
                          0,
                          fieldsRestr.uid.maxLength
                        )
                        mnUser.uid = e.target.value
                      }
                    "
                  />
                </b-col>
                <b-col cols="4" class="px-0">
                  <button
                    class="button btn-grey"
                    @click.stop.prevent="genUserId"
                  >
                    {{ `${$t('label.auto')}` }}
                  </button></b-col
                >
              </template>
            </b-row>
          </b-form-group>

          <b-form-group
            :disabled="isUserDelete"
            id="input-group-fullname"
            :invalid-feedback="validateErrorMessage('fullname')"
            :state="validateState('fullname')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  :value="mnUser.fullname"
                  :maxLength="fieldsRestr.fullname.maxLength"
                  :placeholder="`${$t('users.user_fullname')}`"
                  :state="validateState('fullname')"
                  @input.native="
                    (e) => {
                      e.target.value = e.target.value.substring(
                        0,
                        fieldsRestr.fullname.maxLength
                      )
                      mnUser.fullname = e.target.value
                    }
                  "
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group :disabled="isUserDelete" id="input-group-gid">
            <b-row>
              <b-col>
                <multiselect
                  v-if="!isUpdatingUserData"
                  v-model="mnUser.gids"
                  :items="group_options"
                  :placeholder="`${$t('label.group_is_not_selected')}`"
                /> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group
            :disabled="isUserDelete"
            id="input-group-rid"
            :invalid-feedback="validateErrorMessage('rid')"
            :state="validateState('rid')"
          >
            <b-row>
              <b-col>
                <b-form-select
                  v-model="mnUser.rid"
                  :options="role_options"
                  :state="validateState('rid')"
                >
                  <template slot="first">
                    <option :value="null" disabled>{{
                      `${$t('label.role_is_not_selected')}`
                    }}</option>
                  </template>
                </b-form-select>
              </b-col></b-row
            >
          </b-form-group>
          <b-form-group
            :disabled="isUserDelete"
            id="input-group-email"
            :invalid-feedback="validateErrorMessage('email')"
            :state="validateState('email')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  :value="mnUser.email"
                  :placeholder="`${$t('users.user_email')}`"
                  :state="validateState('email')"
                  @input.native="(e) => (mnUser.email = e.target.value)"
                ></b-form-input> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group
            :disabled="isUserDelete"
            id="input-group-phone"
            :invalid-feedback="validateErrorMessage('phone')"
            :state="validateState('phone')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  :value="mnUser.phone"
                  :placeholder="`${$t('users.user_phone')}`"
                  :state="validateState('phone')"
                  @input.native="(e) => (mnUser.phone = e.target.value)"
                ></b-form-input> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group
            :disabled="isUserDelete"
            id="input-group-password"
            :invalid-feedback="validateErrorMessage('password')"
            :state="validateState('password')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  :value="mnUser.password"
                  type="password"
                  :placeholder="`${$t('users.password')}`"
                  :state="validateState('password')"
                  @input.native="(e) => (mnUser.password = e.target.value)"
                ></b-form-input> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group
            :disabled="isUserDelete"
            id="input-group-conf-password"
            :invalid-feedback="validateErrorMessage('confPassword')"
            :state="validateState('confPassword')"
          >
            <b-row>
              <b-col>
                <b-form-input
                  :value="mnUser.confPassword"
                  type="password"
                  :placeholder="`${$t('users.conf_password')}`"
                  :state="validateState('confPassword')"
                  @input.native="(e) => (mnUser.confPassword = e.target.value)"
                ></b-form-input> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group
            :disabled="isUserDelete"
            id="input-group-activity-period"
          >
            <b-row>
              <b-col>
                <b-form-checkbox
                  v-model="enabledActivityPeriod"
                  name="check-button"
                  switch
                  @change="onEnableActivity"
                >
                  {{ $t('users.usage_period') }}
                </b-form-checkbox>
              </b-col></b-row
            >
            <b-row>
              <b-col>
                <datetime
                  class="datepicker"
                  format="YYYY-MM-DD"
                  :readonly="true"
                  v-model="mnUser.activity_start"
                  :disabled="!enabledActivityPeriod"
                ></datetime
              ></b-col>
              <b-col>
                <datetime
                  class="datepicker"
                  format="YYYY-MM-DD"
                  :readonly="true"
                  v-model="mnUser.activity_finish"
                  :disabled="!enabledActivityPeriod"
                ></datetime> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group :label="`${$t('users.send_tele_link')}:`">
            <b-row>
              <b-col>
                <b-form-checkbox-group
                  id="checkbox-group-telegram"
                  v-model="serv_send_tegram_auth_selected"
                  :options="telegram_send_list"
                  name="flavour-1"
                >
                </b-form-checkbox-group>
              </b-col>
            </b-row>
          </b-form-group>
          <div class="user-operation-button-zone">
            <button v-if="!isUserDelete" type="submit" class="button btn-blue">
              {{ `${$t('label.save')}` }}
            </button>
            <button @click="onCancel" class="button btn-braun">
              {{ `${$t('label.back')}` }}
            </button>
          </div>
        </b-container>
      </b-form>
    </template>
    <b-modal ref="error-modal" id="e-modal" title="Error" ok-only centered  >
      <p class="my-3">{{ error_text }}</p>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import multiselect from '@/components/elements/multiselect'
import datetime from '@/components/elements/datetimepicker'
import validMixin from '@/mixins/validation'

export default {
  name: 'user-mng-form',
  mixins: [validMixin],
  props: {
    oper: String
  },
  data() {
    return {
      validFormName: 'mnUser',
      uidUniqError: '',
      emailUniqError: '',
      error_text: '',
      mnUser: {
        uid: '',
        fullname: '',
        gid: null,
        gids: [],
        rid: null,
        email: '',
        phone: '',
        password: '',
        deleted_at: '',
        activity_start: '',
        activity_finish: '',
        confPassword: ''
      },
      telegram_send_list: [
        {text: this.$t('label.sms'), value: 'sms'},
        {text: this.$t('label.email'), value: 'email'}
      ],
      group_options: [],
      role_options: [],
      enabledActivityPeriod: false,
      userNotFound: false,
      isUpdatingUserData: true,
      defaultUserActivityStart: new Date().toLocalDateString().slice(0, 10),
      defaultUserActivityFinish: '',
      serv_send_tegram_auth_selected: []
    }
  },
  components: {
    multiselect,
    datetime
  },
  watch: {
    ['mnUser.uid'](newVal) {
      if (this.uidUniqError !== '') {
        this.uidUniqError = ''
      }
    },
    ['mnUser.email'](newVal) {
      if (this.emailUniqError !== '') {
        this.emailUniqError = ''
      }
    }
  },

  methods: {
    onCancel(evt) {
      evt.preventDefault()
      //this.$router.go(-1)
      this.$emit('contentElementClick', '/users')
    },

    genUserId(evt) {
      //evt.preventDefault()
      console.log('gen user ID')
    },
    onSubmit(evt) {
      //evt.preventDefault()
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }
      const sendServices = this.serv_send_tegram_auth_selected
      if (sendServices.includes('sms') && this.mnUser.phone === '') {
        this.error_text=this.$t('errors.the_sms_could_not_be_sent_because_the_phone_number_was_not_entered')
        this.$refs['error-modal'].show()
        return
      }

      if (sendServices.includes('email') && this.mnUser.email === '') {
        this.error_text=this.$t('errors.email_could_not_be_sent_because_your_email_address_has_not_been_entered')
        this.$refs['error-modal'].show()
        return
      }
      this.mnUser.sendTelegramAuthBy = [...this.serv_send_tegram_auth_selected]
      const oper_type = this.oper === 'edit' ? 'USER_UPD' : 'USER_ADD'
      this.$store.dispatch(oper_type, this.mnUser).then(
        (res) => {
          if (this.oper === 'edit') {
            this.$router.go(-1)
          } else {
            this.$emit('contentElementClick', '/users')
          }
        },
        (err) => {
          const errMess = err.message.replace('Error: ', '')
          switch (errMess) {
            case 'THIS_UID_IS_NOT_ALLOWED':
              this.uidUniqError = errMess
              break
            case 'THIS_EMAIL_IS_NOT_ALLOWED':
              this.emailUniqError = errMess
              break
            default:
              console.log('error=', errMess)
              break
          }
        }
      )
    },
    onEnableActivity(evt) {
      if (!evt) {
        this.mnUser.activity_finish = ''
        this.mnUser.activity_start = this.defaultUserActivityStart
      } else {
        this.mnUser.activity_finish = this.defaultUserActivityFinish
      }
    }
  },

  created() {
    const {uid = null} = this.$route.params
    const cid = this.cid
    this.isUpdatingUserData = true
    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_USER_INFO', {cid, uid}).then(
        (res) => {
          this.isUpdatingUserData = false
          this.mnUser = {...this.mnUser, ...res}
          if (this.mnUser.gid === '') {
            this.mnUser.gid = null
          }
          if (this.mnUser.rid === '') {
            this.mnUser.rid = null
          }

          this.defaultUserActivityStart = this.mnUser.activity_start
          this.defaultUserActivityFinish = this.mnUser.activity_finish

          this.enabledActivityPeriod =
            this.mnUser.activity_finish !== '' ? true : false
        },
        (error) => {
          this.userNotFound = true
        }
      )
    } else {
      const query = this.$route.query
      if (query) {
        const {gid = null, rid = null} = query
        this.mnUser.rid = rid
        if (gid) {
          this.mnUser.gids.push(+gid)
        }
        this.isUpdatingUserData = false
      }
    }
    //this.mnUser.activity_start = this.defaultUserActivityStart
    //this.mnUser.activity_finish = this.defaultUserActivityFinish

    this.$store.dispatch('LOAD_GROUPS', {cid}).then((res) => {
      // const isExistGid = this.groups.find((group) => {
      //   return group.gid === this.mnUser.gid && !Boolean(group.deleted_at)
      // })
      // if (!isExistGid) {
      //   this.mnUser.gid = null
      // }
      this.$store.commit('SET_GROUPS_IS_LOADING', false)
      this.group_options = this.groups
        .filter((group) => !Boolean(group.deleted_at))
        .map((item) => {
          return {value: item.gid, text: item.name}
        })
    })
    this.$store.dispatch('LOAD_ROLES', {cid}).then((res) => {
      this.role_options = this.roles
        .filter((role) => !Boolean(role.deleted_at))
        .map((item) => {
          return {value: item.rid, text: item.name}
        })
      const isExistRid = this.roles.find((role) => {
        return role.rid === this.mnUser.rid && !Boolean(role.deleted_at)
      })
      if (!isExistRid) {
        this.mnUser.rid = null
      }
    })
  },
  computed: {
    ...mapGetters(['groups', 'roles', 'groups_is_loading']),
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id,
      fieldsRestr: (store) => store.FieldRestr.categories.users
    }),
    user_title() {
      return `users.oper_title_${this.oper}`
    },
    isUserDelete() {
      return Boolean(this.mnUser.deleted_at)
    },
    isAddForm() {
      return this.oper === 'add'
    }
  }
}
</script>

<style lang="scss">
.datepicker {
  height: 40px;
  width: 100%;
  margin-bottom: 10px;
}
p.row-space {
  padding: 0 10px;
}

.row-group-activity-period {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.user-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }

  .user-operation-button-zone {
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
.user-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
