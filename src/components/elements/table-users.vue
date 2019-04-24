<template>
  <div class="users-table">
    <table class="p-table">
      <thead>
        <th></th>
        <th>{{ $t('users.tbl_header_ID') }}</th>
        <th>{{ $t('users.tbl_header_name') }}</th>
        <th>{{ $t('users.tbl_header_group') }}</th>
        <th>{{ $t('users.tbl_header_last_login') }}</th>
        <th>{{ $t('users.tbl_header_mgn') }}</th>
      </thead>
      <tbody>
        <tr v-for="user in users_list" :key="user.cid">
          <td align="center">
            <b-form-checkbox
              :id="user.cid"
              :name="`ch-${user.cid}`"
              :value="user['cid']"
              v-model="users_selected"
            ></b-form-checkbox>
          </td>
          <td align="right">
            <a href="#">{{ user.cid }}</a>
          </td>
          <td align="right">{{ user.name }}</td>
          <td align="right">{{ user.group }}</td>
          <td align="right">{{ user.last_login }}</td>
          <td align="center">
            <a href="#"><img src="@/assets/images/delete_black.png"/></a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="users-mng-panel">
      <span>{{ $t('users.in_page') }}:</span>
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
      <div class="users-mng-pag">
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
  name: 'table-users',
  data() {
    return {
      perPage: 3,
      currentPage: 1,
      rows: 8,
      users_selected: []
    }
  },
  methods: {
    toggleAll(env) {
      const action = env.target['id']
      this.users_selected =
        action === 'selectAll'
          ? this.users_list.map(user => String(user.cid))
          : []
      console.log('this.users_selected=', this.users_selected)
    }
  },
  computed: {
    ...mapGetters(['users_list'])
  }
}
</script>

<style lang="scss" scoped>

.users-table {
  padding: 10px 0;
}
.users-mng-panel {
  display: flex;
  align-items: center;

  .users-mng-pag {
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
