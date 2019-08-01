<template>
  <div class="role-operation">
    <span>{{ $t(role_title) }}</span>
    <template v-if="oper === 'edit'">
      <div class="role-oper-id">
        <span>{{ `${$t('roles.role_id')}: ${mnRole.rid}` }}</span>
      </div>
    </template>
    <template v-else-if="oper === 'add'">
      <b-form-input v-model="mnRole.rid" :placeholder="`${$t('roles.role_id')}`"></b-form-input>
    </template>
    <b-form-input v-model="mnRole.name" :placeholder="`${$t('roles.role_name')}`"></b-form-input>
    <div class="check-admin">
      <span>{{$t('roles.administrator')}}:</span>
      <b-form-checkbox
        id="check_isAdmin"
        v-model="mnRole.is_admin"
        name="check_isAdmin"
      >
      </b-form-checkbox>
      <div>
        <strong>{{ $t(`label.${is_admin_state}`) }}</strong>
      </div>
    </div>
    <div class="role-operation-button-zone">
      <button @click="save_click" class="button btn-blue">{{$t('label.save')}}</button>
      <button @click="cancel_click" class="button btn-braun">{{$t('label.cancel')}}</button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

const re = /\.(\w+)$/i

export default {
  name: 'role-mng-form',
  data() {
    return {
      mnRole: {
        is_admin: false,
        name: '',
        rid: ''
      }
    }
  },
  methods: {
    cancel_click() {
      this.$emit('contentElementClick', 'root.roles')
    },
    save_click() {
      const oper_type = this.oper === 'edit' ? 'ROLE_UPD' : 'ROLE_ADD'
      this.$store.dispatch(oper_type, this.mnRole).then(
        res => {
          this.$emit('contentElementClick', 'root.roles')
        },
        err => {
          console.log('err=', err)
        }
      )
    }
  },

  created() {
    if (this.oper === 'edit') {
      this.mnRole = {...this.role_selected}
    }
    
  },
  computed: {
    ...mapGetters(['userMenuActiveItem', 'role_selected']),
    oper() {
      return this.userMenuActiveItem.match(re)[1].split('_')[1]
    },
    role_title() {
      return `roles.oper_title_${this.oper}`
    },
    is_admin_state() {
      return this.mnRole.is_admin ? 'yes' : 'no'
    }
  }
}
</script>

<style lang="scss">
.role-operation {
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }
  > * {
    margin-bottom: 20px;
  }
  .role-oper-id {
    font-size: 1.2em;
  }
  input {
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
  .role-operation-button-zone {
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
