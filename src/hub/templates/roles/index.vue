<template>
  <div class="roles-mng">
    <div class="roles-mng-buttons">
      <button class="create-new blue" @click="addNewRole">
        {{ $t('roles.btn_add') }}
      </button>
    </div>
    <div class="roles-mng-table">
      <TableRoles/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import TableRoles from '@/components/elements/table-roles'

export default {
  name: 'roles-mng',
  components: {
    TableRoles
  },
  created() {
    this.$store.dispatch('LOAD_ROLES', this.me.profile.company_id)
  },
  computed: {
    ...mapGetters(['me'])
  },
  methods: {
    addNewRole() {
      this.$store.commit('SET_ACTIVE_ROLE', {company_id: this.me.profile.company_id, rid: null})
      this.$emit('contentElementClick', 'root.subItems.roles.subItems.role_add')
    }
  }
}
</script>

<style lang="scss">
.roles-mng {
  .roles-mng-buttons {
    padding: 10px 0;
    .create-new {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 150px;
      height: 40px;
      color: #ffffff;
    }
    .blue {
      background: #4472c4;
    }
  }
}
</style>
