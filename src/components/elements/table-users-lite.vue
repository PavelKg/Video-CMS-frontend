<template>
  <div class="users-table">
    <div class="user-table-mng">
      <span>
        {{ $t('message.number_of_registered_users') }}: {{ users_count }}
        {{ $t('label.people') }}
      </span>
      <button
        v-if="isActAllow('add')"
        class="button btn-blue add-user"
        @click="addNewUser"
        @keyup="
          () => {
            console.log('into comp')
          }
        "
      >
        {{ $t('users.btn_add') }}
      </button>
    </div>
    <b-table
      :items="users_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
      <template #cell(uid)="item"
        ><a @click.prevent="updUser(item.item)" href="#"
          ><p class="truncate-text">{{ item.item.uid }}</p></a
        >
      </template>
      <template #cell(fullname)="item"
        ><p class="truncate-text">{{ item.item.fullname }}</p>
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
import permitsMixin from '@/mixins/permits'

export default {
  name: 'table-users-lite',
  mixins: [ permitsMixin],
  data() {
    return {
      permitsCategory: 'users',
      fields: [
        {key: 'uid', label: 'ID', thStyle: {'text-align': 'center'}},
        {
          key: 'fullname',
          label: this.$t('users.tbl_header_name'),
          thStyle: {'max-width': '500px !important', 'text-align': 'center'},
          tdClass: 'table-column'
        }
      ],
      perPage: 5,
      currentPage: 1
    }
  },
  props: {gid: Number},
  methods: {
    addNewUser() {
      this.$emit('contentElementClick', `/users/add?gid=${this.gid}`)
    },
    updUser(userInfo) {
      if (this.isActAllow('edit')) {
        const {cid, uid} = userInfo
        this.$emit('contentElementClick', `/users/edit/${uid}`)
      }
    }
  },
  computed: {
    ...mapGetters(['users_list', 'me']),
    active_users() {
      return this.users_list.filter((user) => !Boolean(user.deleted_at))
    },
    users_count() {
      return this.active_users ? this.active_users.length : 0
    },
    users_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.active_users.slice(begin, end)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';

.users-table {
  padding: 10px 0;
  .user-table-mng {
    display: flex;
    .add-user {
      margin-bottom: 5px;
      margin-left: auto;
    }
    span {
      color: $link;
      align-self: center;
      //font-weight: 500;
    }
  }
}

.users-mng-pag {
  display: flex;
  justify-content: flex-end;
}

.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
