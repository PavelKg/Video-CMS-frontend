<template>
  <div class="roles-mng">
    <div class="button-zone">
      <button v-if="isActAllow('add')" class="button btn-blue" @click="addNewRole">
        {{ $t('roles.btn_add') }}
      </button>
      <b-checkbox
        class="ml-auto pt-2"
        v-model="isShowDeleted"
        @input="loadRolesList"
      >
        {{ $t('label.show_deleted') }}
      </b-checkbox>
    </div>
    <div class="roles-mng-table">
      <TableRoles
        @contentElementClick="contentElementClick"
        @onContentError="onError"
        @reloadData="loadRolesList"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import TableRoles from '@/components/elements/table-roles'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'roles-mng',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'roles',
      isShowDeleted: false
    }
  },
  components: {
    TableRoles
  },
  created() {
    this.loadRolesList()
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id
    })
  },
  methods: {
    loadRolesList() {
      const cid = this.cid
      const filter = !this.isShowDeleted ? 'roles.deleted_at[isNull]:' : ''
      this.$store
        .dispatch('LOAD_ROLES', {cid, filter})
        .then(() => this.$store.commit('SET_ROLES_IS_LOADING', false))
    },
    addNewRole() {
      this.contentElementClick('/roles/add')
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    onError(message) {
      this.$store.commit('SHOW_MESSAGE_ERROR', message)
    }
  }
}
</script>

<style lang="scss">
.button-zone {
  display: flex;
}
// .roles-mng {
//   .roles-mng-buttons {
//     padding: 10px 0;
//     .create-new {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       cursor: pointer;
//       width: 150px;
//       height: 40px;
//       color: #ffffff;
//     }
//     .blue {
//       background: #4472c4;
//     }
//   }
//}
</style>
