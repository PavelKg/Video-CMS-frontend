<template>
  <div class="groups-table">
    <table class="p-table">
      <thead>
        <th></th>
        <th>{{ $t('groups.tbl_header_name') }}</th>
        <th>{{ $t('groups.tbl_header_mgn') }}</th>
      </thead>
      <tbody>
        <tr v-for="group in groups_list" :key="group.cid">
          <td align="center">
            <b-form-checkbox
              :id="group.cid"
              :name="`ch-${group.cid}`"
              :value="group['cid']"
              v-model="groups_selected"
            ></b-form-checkbox>
          </td>
          <td align="right">{{ group.name }}</td>
          <td align="center">
            <a href="#"><img src="@/assets/images/delete_black.png"/></a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="groups-mng-panel">
      <span>{{ $t('groups.in_page') }}:</span>
      <a href="#" id="selectAll" @click="toggleAll">{{
        $t('label.select_all')
      }}</a>
      <span>|</span>
      <a href="#" id="deselectAll" @click="toggleAll">{{
        $t('label.deselect_all')
      }}</a>
            <button class="button btn-orange">
        {{ $t('label.delete') }}
      </button>
      <div class="groups-mng-pag">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        align="left"
      ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'table-groups',
  data() {
    return {
      perPage: 3,
      currentPage: 1,
      rows: 8,
      groups_selected: []
    }
  },
  methods: {
    toggleAll(env) {
      const action = env.target['id']
      this.groups_selected =
        action === 'selectAll'
          ? this.groups_list.map(group => String(group.cid))
          : []
      console.log('this.groups_selected=', this.groups_selected)
    }
  },
  computed: {
    ...mapGetters(['groups_list'])
  }
}
</script>

<style lang="scss" scoped>

.groups-table {
  padding: 10px 0;
}
.groups-mng-panel {
  display: flex;
  align-items: center;

  .groups-mng-pag {
    display: flex;
    margin-left: auto;
    > * {
        margin-bottom:0;    
    }
  }
  a {
    padding: 0 10px;
  }
}
</style>
