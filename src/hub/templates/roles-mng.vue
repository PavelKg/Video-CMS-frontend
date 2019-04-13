<template>
  <div class="roles-mng">
    <div class="roles-mng-buttons">
      <div class="create-new blue">
        {{ $t('roles.btn_add') }}
      </div>
    </div>
    <div class="roles-mng-table">
      <TableRoles/>
    </div>
  </div>
</template>

<script>
import TableRoles from '@/components/elements/table-roles'

export default {
  name: "roles-mng",
  components: {
    TableRoles
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
