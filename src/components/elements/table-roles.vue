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
        <tr
          v-for="role in roles"
          :key="role.rid"
          :class="{deleted_item: role.deleted_at !== ''}"
        >
          <td >
            {{ role.rid }}
          </td>
          <td align="right">{{ role.name }}</td>
          <td align="center">
            {{ role.isAdmin ? $t('label.yes') : $t('label.no') }}
          </td>
          <template v-if="role.deleted_at === ''">
            <td
              align="center"
              class="cell-icon"
              :title="`${$t('label.edit')}`"
              @click="editRole(role)"
            >
              <img src="@/assets/images/edit_black.png" />
            </td>
            <td
              align="center"
              class="cell-icon"
              :title="`${$t('label.delete')}`"
              @click="delRole(role)"
            >
              <img src="@/assets/images/delete_black.png" />
            </td>
          </template>
          <template v-else>
            <td colspan="2">
              {{ $t('roles.tbl_deleted') }}
            </td>
          </template>
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
      this.$emit(
        'contentElementClick',
        'root.subItems.roles.subItems.role_edit'
      )
    },
    delRole(role) {
      this.$store.commit('SET_ACTIVE_ROLE', role)
      this.$store.dispatch('ROLE_DEL').then(
        res => {
          this.$store.dispatch('LOAD_ROLES', this.me.profile.company_id)
        },
        err => {
          console.log('err=', err)
        }
      )
    }
  },
  computed: {
    ...mapGetters(['roles', 'roles_is_list_loading', 'me'])
  },
  components: {}
}
</script>

<style lang="scss">
@import '../../assets/styles';

.table-roles {
}
.deleted_item {
  color: $link;
}
.cell-icon {
  width: 40px;
  cursor: pointer;
}
</style>
