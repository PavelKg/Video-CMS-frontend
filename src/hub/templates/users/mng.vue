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
      <b-form @submit="onSubmit">
        <b-form-group id="input-group-id">
          <div class="user-oper-id">
            <template v-if="oper === 'edit'">
              <span>{{ `${$t('users.user_id')}` }} : {{ mnUser.uid }} </span>
            </template>
            <template v-if="oper === 'add'">
              <b-form-input
                v-model="mnUser.uid"
                :placeholder="`${$t('users.user_id')}`"
                required
              ></b-form-input>
              <button class="button btn-grey" @click="genUserId">
                {{ `${$t('label.auto')}` }}
              </button>
            </template>
          </div>
        </b-form-group>
        <b-form-group :disabled="isUserDelete" id="input-group-fullname">
          <b-form-input
            v-model="mnUser.fullname"
            :placeholder="`${$t('users.user_fullname')}`"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group :disabled="isUserDelete" id="input-group-gid">
          <multiselect
            v-if="!isUpdatingUserData"
            v-model="mnUser.gids"
            :items="group_options"
            :placeholder="`${$t('label.group_is_not_selected')}`"
          />
        </b-form-group>
        <b-form-group :disabled="isUserDelete" id="input-group-rid">
          <b-form-select v-model="mnUser.rid" :options="role_options" required>
            <template slot="first">
              <option :value="null" disabled>{{
                `${$t('label.role_is_not_selected')}`
              }}</option>
            </template>
          </b-form-select>
        </b-form-group>
        <b-form-group :disabled="isUserDelete" id="input-group-email">
          <b-form-input
            v-model="mnUser.email"
            :placeholder="`${$t('users.user_email')}`"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group :disabled="isUserDelete" id="input-group-password">
          <b-form-input
            v-model="mnUser.password"
            type="password"
            :placeholder="`${$t('users.password')}`"
            :required="oper === 'add'"
          ></b-form-input>
        </b-form-group>
        <b-form-group :disabled="isUserDelete" id="input-group-conf-password">
          <b-form-input
            v-model="mnUser.confPassword"
            type="password"
            :placeholder="`${$t('users.conf_password')}`"
            :required="oper === 'add' && mnUser.password !== ''"
          ></b-form-input>
        </b-form-group>
        <div class="user-operation-button-zone">
          <button v-if="!isUserDelete" type="submit" class="button btn-blue">
            {{ `${$t('label.save')}` }}
          </button>
          <button @click="onCancel" class="button btn-braun">
            {{ `${$t('label.back')}` }}
          </button>
        </div>
      </b-form>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import multiselect from '@/components/elements/multiselect'

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
        deleted_at: ''
      },
      group_options: [],
      role_options: [],
      userNotFound: false,
      isUpdatingUserData: true
    }
  },
  components: {
    multiselect
  },
  methods: {
    onCancel(evt) {
      evt.preventDefault()
      //this.$router.go(-1)
      this.$emit('contentElementClick', '/hub/users')
    },
    save_click() {},
    genUserId(evt) {
      evt.preventDefault()
      console.log('gen user ID')
    },
    onSubmit(evt) {
      evt.preventDefault()

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
    }
  },

  created() {
    const {uid = null} = this.$route.params
    const cid = this.me.profile.company_id
    this.isUpdatingUserData = true
    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_USER_INFO', {cid, uid}).then(
        (res) => {
          console.log('res=', res)
          this.isUpdatingUserData = false
          this.mnUser = {...res}
          if (this.mnUser.gid === '') {
            this.mnUser.gid = null
          }
          if (this.mnUser.rid === '') {
            this.mnUser.rid = null
          }
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

    this.$store.dispatch('LOAD_GROUPS', cid).then((res) => {
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

        console.log('this.group_options=', this.group_options)
    })
    this.$store.dispatch('LOAD_ROLES', cid).then((res) => {
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
.user-operation {
  max-width: 450px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }
  > * {
    margin-bottom: 20px;
  }
  .user-oper-id {
    display: flex;
    align-items: center;
    font-size: 1.2em;
  }
  input {
  }
  select {
  }

  .button {
    margin: 0 10px;
  }
  .check-admin {
    display: flex;
    justify-content: space-between;

    > * {
      margin-right: 10px;
    }
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
