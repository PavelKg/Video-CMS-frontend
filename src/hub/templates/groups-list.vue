<template>
  <div class="groups-mng">
    <button class="button btn-blue">
      {{ $t('groups.btn_add') }}
    </button>
    <groupsTable />
  </div>
</template>

<script>
import groupsTable from '@/components/elements/table-groups'

export default {
  name: 'groups-mng',
  components: {
    groupsTable
  }
}
</script>

<style lang="scss">
.groups-mng {
}
</style>
