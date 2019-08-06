<template>
  <div class="role-operation">
    <span>{{ $t(role_title) }}</span>
    <template v-if="oper === 'edit'">
      <div class="role-oper-id">
        <span>{{ `${$t('roles.role_id')}: ${mnRole.rid}` }}</span>
      </div>
    </template>
    <template v-else-if="oper === 'add'">
      <b-form-input
        v-model="mnRole.rid"
        :placeholder="`${$t('roles.role_id')}`"
      ></b-form-input>
    </template>
    <b-form-input
      v-model="mnRole.name"
      :placeholder="`${$t('roles.role_name')}`"
      :disabled="isDeleted"
    ></b-form-input>
    <div class="check-admin">
      <span>{{ $t('roles.administrator') }}:</span>
      <b-form-checkbox
        id="check_isAdmin"
        v-model="mnRole.is_admin"
        name="check_isAdmin"
        :disabled="isDeleted"
      >
      </b-form-checkbox>
      <div>
        <strong>{{ $t(`label.${is_admin_state}`) }}</strong>
      </div>
    </div>
    <div class="role-operation-button-zone">
      <button
        @click="save_click"
        class="button btn-blue"
        :disabled="onDisabledSave"
      >
        {{ $t('label.save') }}
      </button>
      <button @click="cancel_click" class="button btn-braun">
        {{ $t('label.cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'role-mng-form',
  props: {
    oper: String
  },
  data() {
    return {
      mnRole: {
        is_admin: false,
        name: '',
        rid: ''
      },
      defRole: {
        is_admin: false,
        name: ''
      }
    }
  },
  methods: {
    cancel_click() {
      this.$emit('contentElementClick', '/hub/roles')
    },
    save_click() {
      const oper_type = this.oper === 'edit' ? 'ROLE_UPD' : 'ROLE_ADD'
      this.$store.dispatch(oper_type, this.mnRole).then(
        (res) => {
          this.$emit('contentElementClick', '/hub/roles')
        },
        (err) => {
          console.log('err=', err)
        }
      )
    }
  },

  created() {
    const {rid = null} = this.$route.params
    const cid = this.me.profile.company_id

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_ROLE_INFO', {cid, rid}).then((role) => {
        this.defRole.name = role.name
        this.defRole.is_admin = role.is_admin
        this.mnRole = {...role}
      })
    } else {
      this.mnRole.cid = cid
    }
  },
  computed: {
    ...mapGetters(['userMenuActiveItem', 'me']),
    role_title() {
      return `roles.oper_title_${this.oper}`
    },
    is_admin_state() {
      return this.mnRole.is_admin ? 'yes' : 'no'
    },
    onDisabledSave() {
      if (this.oper === 'edit') {
        return (
          this.mnRole.name === this.defRole.name &&
          this.mnRole.is_admin === this.defRole.is_admin
        )
      } else {
        return false // check field
      }
    },
    isDeleted() {
      return Boolean(this.mnRole.deleted_at)
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
