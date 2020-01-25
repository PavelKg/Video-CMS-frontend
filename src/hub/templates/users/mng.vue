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
          <b-form-group id="input-group-id">
            <b-row ml="0" align-v="start" align-h="around">
              <template v-if="oper === 'edit'">
                <b-col>
                  <span
                    >{{ `${$t('users.user_id')}` }} : {{ mnUser.uid }}
                  </span>
                </b-col>
              </template>
              <template v-if="oper === 'add'">
                <b-col cols="8" class="px=0">
                  <b-form-input
                    v-model="mnUser.uid"
                    :placeholder="`${$t('users.user_id')}`"
                    :state="validateState('uid')"
                  ></b-form-input>
                  <b-form-invalid-feedback id="input-1-live-feedback"
                    >This is a required field and must be at least 3
                    characters.</b-form-invalid-feedback
                  >
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

          <b-form-group :disabled="isUserDelete" id="input-group-fullname">
            <b-row>
              <b-col>
                <b-form-input
                  v-model="mnUser.fullname"
                  :placeholder="`${$t('users.user_fullname')}`"
                  :state="validateState('fullname')"
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
                  :state="validateState('gids')"
                /> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group :disabled="isUserDelete" id="input-group-rid">
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
          <b-form-group :disabled="isUserDelete" id="input-group-email">
            <b-row>
              <b-col>
                <b-form-input
                  v-model="mnUser.email"
                  :placeholder="`${$t('users.user_email')}`"
                  :state="validateState('email')"
                ></b-form-input> </b-col
            ></b-row>
          </b-form-group>

          <b-form-group :disabled="isUserDelete" id="input-group-password">
            <b-row>
              <b-col>
                <b-form-input
                  v-model="mnUser.password"
                  type="password"
                  :placeholder="`${$t('users.password')}`"
                  :required="oper === 'add'"
                  :state="validateState('password')"
                ></b-form-input> </b-col
            ></b-row>
          </b-form-group>
          <b-form-group :disabled="isUserDelete" id="input-group-conf-password">
            <b-row>
              <b-col>
                <b-form-input
                  v-model="mnUser.confPassword"
                  type="password"
                  :placeholder="`${$t('users.conf_password')}`"
                  :required="oper === 'add' && mnUser.password !== ''"
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
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import multiselect from '@/components/elements/multiselect'
import datetime from '@/components/elements/datetimepicker'
import {required, minLength, between} from 'vuelidate/lib/validators'

export default {
  name: 'user-mng-form',
  props: {
    oper: String
  },
  data() {
    return {
      mnUser: {
        uid: '',
        fullname: '',
        gid: null,
        gids: [],
        rid: null,
        email: '',
        password: null,
        deleted_at: '',
        activity_start: '',
        activity_finish: ''
      },
      group_options: [],
      role_options: [],
      enabledActivityPeriod: false,
      userNotFound: false,
      isUpdatingUserData: true,
      defaultUserActivityStart: new Date().toLocalDateString().slice(0, 10),
      defaultUserActivityFinish: ''
    }
  },
  components: {
    multiselect,
    datetime
  },
  validations: {
    mnUser: {
      uid: {
        required
      },
      fullname: {
        required,
        minLength: minLength(3)
      },
      gids: {
        required
      },
      rid: {
        required
      },
      email: {
        required
      },
      password: {
        required
      },
      confPassword: {
        required
      }
    }
  },
  methods: {
    validateState(name) {
      const {$dirty, $error} = this.$v.mnUser[name]
      return $dirty ? !$error : null
    },
    onCancel(evt) {
      evt.preventDefault()
      //this.$router.go(-1)
      this.$emit('contentElementClick', '/hub/users')
    },
    save_click() {},
    genUserId(evt) {
      //evt.preventDefault()
      console.log('gen user ID')
    },
    onSubmit(evt) {
      //evt.preventDefault()
      this.$v.mnUser.$touch()
      if (this.$v.mnUser.$anyError) {
        console.log('field error')
        return
      }

      const oper_type = this.oper === 'edit' ? 'USER_UPD' : 'USER_ADD'
      this.$store.dispatch(oper_type, this.mnUser).then(
        (res) => {
          if (this.oper === 'edit') {
            this.$router.go(-1)
          } else {
            this.$emit('contentElementClick', '/hub/users')
          }
        },
        (err) => {
          console.log('err=', err)
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
    const cid = this.me.profile.company_id
    this.isUpdatingUserData = true
    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_USER_INFO', {cid, uid}).then(
        (res) => {
          this.isUpdatingUserData = false
          this.mnUser = {...res}
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
    ...mapGetters(['groups', 'roles', 'me', 'groups_is_loading']),
    user_title() {
      return `users.oper_title_${this.oper}`
    },
    isUserDelete() {
      return Boolean(this.mnUser.deleted_at)
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
  // > * {
  //   margin-bottom: 20px;
  // }

  // .button {
  //   margin: 0 10px;
  // }
  // .check-admin {
  //   display: flex;
  //   justify-content: space-between;

  //   > * {
  //     margin-right: 10px;
  //   }
  // }
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
