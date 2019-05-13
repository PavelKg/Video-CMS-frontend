<template>
  <div class="users-table">
    <button class="button btn-blue add-user">
      {{ $t('users.btn_add') }}
    </button>
    <span
      >{{ $t('message.number_of_registered_users') }}: {{ users_count }}
      {{ $t('label.people') }}</span
    >
    <b-table
      :items="users_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
      <template slot="uid" slot-scope="item"
        ><a href="#">{{ item.item.uid }}</a>
      </template>
      <template slot="fullname" slot-scope="item"
        ><div class="name-column">{{ item.item.fullname }}</div>
      </template>
    </b-table>
    <div class="users-mng-pag">
      <b-pagination
        v-model="currentPage"
        :total-rows="users_count"
        :per-page="perPage"
        align="left"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'table-users-lite',
  data() {
    return {
      fields: [
        {key: 'uid', label: 'ID', thStyle: {'text-align': 'center'}},
        {
          key: 'fullname',
          label: 'Name',
          thStyle: {'max-width': '500px !important', 'text-align': 'center'},
          tdClass: 'table-column'
        }
      ],
      perPage: 5,
      currentPage: 1
    }
  },
  methods: {},
  computed: {
    ...mapGetters(['users_list']),
    users_count() {
      return this.users_list ? this.users_list.length : 0
    },
    users_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.users_list.slice(begin, end)
    }
  }
}
</script>

<style lang="scss" scoped>
.users-table {
  padding: 10px 0;
  .add-user {
    margin-bottom: 10px;
    margin-left: auto;
  }
  span{
    font-weight: 600
  }
}
.name-column {
  display: flex;
  justify-content: center;
}
.users-mng-pag {
  display: flex;
  justify-content: flex-end;
}
</style>
