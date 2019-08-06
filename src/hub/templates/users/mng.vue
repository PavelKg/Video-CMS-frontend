<template>
  <div class="user-operation">
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
      <b-form-group id="input-group-fullname">
        <b-form-input
          v-model="mnUser.fullname"
          :placeholder="`${$t('users.user_fullname')}`"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-gid">
        <b-form-select v-model="mnUser.gid" :options="group_options">
          <template slot="first">
            <option :value="null"
              ><b>{{ `${$t('label.group_is_not_selected')}` }}</b></option
            >
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group id="input-group-rid">
        <b-form-select v-model="mnUser.rid" :options="role_options" required>
          <template slot="first">
            <option :value="null" disabled>{{
              `${$t('label.role_is_not_selected')}`
            }}</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group id="input-group-email">
        <b-form-input
          v-model="mnUser.email"
          :placeholder="`${$t('users.user_email')}`"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-password">
        <b-form-input
          v-model="mnUser.password"
          type="password"
          :placeholder="`${$t('users.password')}`"
          :required="oper === 'add'"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-conf-password">
        <b-form-input
          v-model="mnUser.confPassword"
          type="password"
          :placeholder="`${$t('users.conf_password')}`"
          :required="oper === 'add' && mnUser.password !== ''"
        ></b-form-input>
      </b-form-group>
      <template v-if="oper === 'edit'"> </template>
      <template v-else-if="oper === 'add'"> </template>
      <div class="user-operation-button-zone">
        <button type="submit" class="button btn-blue">
          {{ `${$t('label.save')}` }}
        </button>
        <button @click="cancel_click" class="button btn-braun">
          {{ `${$t('label.cancel')}` }}
        </button>
      </div>
    </b-form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

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
        rid: null,
        email: '',
        password: null
      },
      group_options: [],
      role_options: []
    }
  },
  methods: {
    cancel_click() {
      this.$router.go(-1)
      //this.$emit('contentElementClick', '/hub/users')
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

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_USER_INFO', {cid, uid}).then((res) => {
        this.mnUser = {...res}
      })
    } else {
      const query = this.$route.query
      if (query) {
        const {gid = null, rid = null} = query
        this.mnUser.rid = rid
        this.mnUser.gid = gid
      }
    }

    this.$store.dispatch('LOAD_GROUPS', cid).then((res) => {
      this.$store.commit('SET_GROUPS_IS_LOADING', false)
      this.group_options = this.groups
        .filter((group) => !Boolean(group.deleted_at))
        .map((item) => {
          return {value: item.gid, text: item.name}
        })
    })
    this.$store.dispatch('LOAD_ROLES', cid).then((res) => {
      this.role_options = this.roles
        .filter((role) => !Boolean(role.deleted_at))
        .map((item) => {
          return {value: item.rid, text: item.name}
        })
    })
  },
  computed: {
    ...mapGetters([
      'userMenuActiveItem',
      'user_selected',
      'groups',
      'roles',
      'me'
    ]),
    user_title() {
      return `users.oper_title_${this.oper}`
    }
  }
}
</script>

<style lang="scss">
.user-operation {
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
    max-width: 300px;
  }
  select {
    max-width: 300px;
  }
  .button {
    margin: 0 10px;
  }
  .check-admin {
    display: flex;
    justify-content: space-between;
    max-width: 400px;

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
</style>
