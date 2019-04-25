<template>
  <div class="role-operation">
    <span>{{ $t(role_title) }}</span>
    <template v-if="oper === 'edit'">
      <div class="role-oper-id"><span>{{ `ID: ${role_id}` }}</span></div>
    </template>
    <template v-else-if="oper === 'add'">
      <b-form-input v-model="role_id" placeholder="ID"></b-form-input>
    </template>
    <b-form-input v-model="role_name" placeholder="Role Name"></b-form-input>
    <div class="check-admin">
      <span>Administrator:</span>
      <b-form-checkbox
        id="check_isAdmin"
        v-model="is_admin_stat"
        name="check_isAdmin"
        value="Yes"
        unchecked-value="No"
      >
      </b-form-checkbox>
      <div>
        <strong>{{ is_admin_stat }}</strong>
      </div>
    </div>
    <div class="role-operation-button-zone">
      <button @click="save_click" class="button btn-blue">Save</button>
      <button @click="cancel_click" class="button btn-blue">Cancel</button>
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
      is_admin_stat: 'No',
      role_name: '',
      role_id: 'Administartor'
    }
  },
  methods: {
    cancel_click() {
      this.$emit('contentElementClick', 'root.subItems.roles')
    },
    save_click() {
      this.$emit('contentElementClick', 'root.subItems.roles')
    }    
  },

  created() {},
  computed: {
    ...mapGetters(['userMenuActiveItem', 'role_selected']),
    oper() {
      return this.userMenuActiveItem.match(re)[1].split('_')[1]
    },
    role_title() {
      return `roles.oper_title_${this.oper}`
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
    font-weight: 600
  }
  > * {
    margin-bottom: 20px;
  }
  .role-oper-id{
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
