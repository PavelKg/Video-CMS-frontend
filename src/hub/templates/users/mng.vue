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
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-gid">
        <b-form-select v-model="mnUser.gid" :options="group_options">
          <template slot="first">
            <option :value="null" disabled><b>Group</b></option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group id="input-group-rid">
        <b-form-select v-model="mnUser.rid" :options="role_options">
          <template slot="first">
            <option :value="null" disabled>Role</option>
          </template>
        </b-form-select>
      </b-form-group>
      <b-form-group id="input-group-email">
        <b-form-input
          v-model="mnUser.email"
          :placeholder="`${$t('users.user_email')}`"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-password">
        <b-form-input
          v-model="mnUser.password"
          :placeholder="`${$t('users.password')}`"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-conf-password">
        <b-form-input
          v-model="mnUser.confPassword"
          :placeholder="`${$t('users.conf_password')}`"
        ></b-form-input>
      </b-form-group>
      <template v-if="oper === 'edit'"> </template>
      <template v-else-if="oper === 'add'"> </template>
      <div class="user-operation-button-zone">
        <button type="submit" class="button btn-blue">Save</button>
        <button @click="cancel_click" class="button btn-blue">Cancel</button>
      </div>
    </b-form>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

const re = /\.(\w+)$/i

export default {
  name: 'user-mng-form',
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
      this.$emit('contentElementClick', 'root.subItems.users')
    },
    save_click() {},
    genUserId(evt) {
      evt.preventDefault()
      console.log('gen user ID')
    },
    onSubmit(evt) {
      evt.preventDefault()
      //alert(JSON.stringify(this.mnUser))

      const oper_type = this.oper === 'edit' ? 'USER_UPD' : 'USER_ADD'
      this.$store.dispatch(oper_type, this.mnUser).then(
        res => {
          this.$emit('contentElementClick', 'root.subItems.users')
        },
        err => {
          console.log('err=', err)
        }
      )
    }
  },

  created() {
    if (this.oper === 'edit') {
      console.log('this.user_selected=', this.user_selected)
      this.mnUser = {...this.user_selected}
    }
    this.$store
      .dispatch('LOAD_GROUPS', this.me.profile.company_id)
      .then(res => {
        this.group_options = this.groups.map(item => {
          return {value: item.gid, text: item.name}
        })
        this.mnUser.gid = Boolean(this.mnUser.gid) ? this.mnUser.gid : null
      })
    this.$store.dispatch('LOAD_ROLES', this.me.profile.company_id).then(res => {
      this.role_options = this.roles.map(item => {
        return {value: item.rid, text: item.name}
      })
      this.mnUser.rid = Boolean(this.mnUser.rid) ? this.mnUser.rid : null
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
    oper() {
      return this.userMenuActiveItem.match(re)[1].split('_')[1]
    },
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
    height: 38px;
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
