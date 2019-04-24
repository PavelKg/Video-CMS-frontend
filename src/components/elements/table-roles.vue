<template>
  <div class="table-roles">
    <table class="p-table">
      <thead>
        <tr>
          <th>
            {{ $t('roles.tbl_header_ID') }}
          </th>
          <th>
            {{ $t('roles.tbl_header_name') }}
          </th>
          <th>
            {{ $t('roles.tbl_header_auth') }}
          </th>
          <th colspan="2">
            {{ $t('roles.tbl_header_mng') }}
          </th>
        </tr>
      </thead>
      <tbody class="scrollContent">
        <tr v-for="role in roles" :key="role.rid">
          <td>
            {{ role.rid }}
          </td>
          <td align="right">{{ role.name }}</td>
          <td align="center">
            {{ role.isAdmin ? $t('label.yes') : $t('label.no') }}
          </td>
          <td align="center" class="cell-icon" title="Edit" @click="editRole(role)">
            <img src="@/assets/images/edit_black.png" />
          </td>
          <td align="center" class="cell-icon" title="Delete">
            <img src="@/assets/images/delete_black.png" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'table-roles',
  data() {
    return {}
  },
  methods: {
    isAdminAuth(isAdminRole) {
      return isAdminRole ? $t('label.yes') : $t('label.no')
    },
    editRole(role) {
      this.$store.commit('SET_ACTIVE_ROLE', role)
      this.$store.commit('ITEM_STATE', 'root.subItems.roles.subItems.role_edit')
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  components: {}
}
</script>

<style lang="scss">
.table-roles {
}
.cell-icon {
  width: 40px;
  cursor: pointer;
}
</style>
