<template>
  <div class="users-table">
    <b-table
      :items="users_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
      :busy="users_is_loading"
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="pl-2">Loading...</strong>
        </div>
      </template>
      <template #cell(uid)="row">
        <b-form-checkbox
          :id="row.item.uid"
          :name="`ch-${row.item.uid}`"
          :value="row.item.uid"
          v-model="users_selected"
          :disabled="row.item.deleted_at !== ''"
          class="truncate-text"
          >{{ row.item.uid }}
        </b-form-checkbox>
      </template>
      <template #cell(last_login)="item">
        <p class="last-login-column truncate-text">
          {{ last_login_format(item.item.last_login) }}
        </p>
      </template>
      <template #cell(fullname)="item">
        <p class="truncate-text">{{ item.item.fullname }}</p>
      </template>
      <template #cell(group_name)="item"
        ><p class="truncate-text">{{ item.item.groups_name.join(', ') }}</p>
      </template>
      <template #cell(mng)="item">
        <div class="mng-column">
          <template v-if="item.item.deleted_at === ''">
            <div class="icon-button">
              <img
                src="@/assets/images/edit_black.png"
                @click="editUser(item.item)"
              />
            </div>
            <div class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delUser(item.item)"
              /></div
          ></template>
          <template v-else>
            {{ $t('users.tbl_deleted') }}
          </template>
        </div>
      </template>
    </b-table>
    <div class="users-mng-panel">
      <span>{{ $t('label.in_page') }}:</span>
      <a href="#" id="selectAll" @click.prevent="toggleAll">{{
        $t('label.select_all')
      }}</a>
      <span>|</span>
      <a href="#" id="deselectAll" @click.prevent="toggleAll">{{
        $t('label.deselect_all')
      }}</a>
      <button
        @click="delSelectUsers"
        class="button btn-orange"
        :disabled="users_selected.length === 0"
      >
        {{ $t('label.delete') }}
      </button>
      <div class="users-mng-pag">
        <b-pagination
          v-model="currentPage"
          @change="setPage"
          :total-rows="users_count"
          :per-page="perPage"
          align="left"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'table-users',
  props: {
    searchVal: String
  },
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      users_selected: [],
      searchReg: undefined
    }
  },

  watch: {
    $route(newVal) {
      this.currentPage = newVal.query.page ? newVal.query.page : 1
    },
    users_is_loading(newVal, oldVal) {
      if (!newVal) {
        this.currentPage =
          this.$route.query.page &&
          this.queriedUsers.length / this.perPage >= this.$route.query.page
            ? this.$route.query.page
            : 1
      }
    },
    searchVal(newVal) {
      this.searchReg = newVal !== '' ? new RegExp(`${newVal}`, 'ig') : undefined
    }
  },
  methods: {
    toggleAll(env) {
      const action = env.target['id']

      this.users_selected =
        action === 'selectAll'
          ? this.users_on_page
              .filter((user) => !Boolean(user.deleted_at))
              .map((user) => String(user.uid))
          : []
    },
    last_login_format(item) {
      return item ? item.slice(0, 10).replace(/\-/gi, '/') : ''
    },
    editUser(userProp) {
      const {cid, uid} = userProp
      this.$emit('contentElementClick', `/hub/users_edit/uid/${uid}`)
    },
    delUser(item) {
      this.$store.dispatch('USER_DEL', item.uid).then(
        (res) => {
          this.$emit('reloadData')
        },
        (err) => {}
      )
    },
    delSelectUsers() {
      const lstore = this.$store
      Promise.all(
        this.users_selected.map(function(user) {
          return lstore.dispatch('USER_DEL', user)
        })
      ).then(
        (res) => {
          this.users_selected = []
          this.$emit('reloadData')
        },
        (err) => {}
      )
    },
    setPage(num) {
      this.$emit('contentElementClick', `/hub/users/?page=${num}`)
    }
  },
  computed: {
    ...mapGetters(['users_list', 'is_mobile_width', 'users_is_loading']),

    users_count() {
      return this.queriedUsers ? this.queriedUsers.length : 0
    },
    users_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.queriedUsers.slice(begin, end)
    },
    queriedUsers() {
      return Boolean(this.searchReg)
        ? this.users_list.filter(
            (item) =>
              item.uid.search(this.searchReg) !== -1 ||
              item.fullname.search(this.searchReg) !== -1 ||
              item.last_login.search(this.searchReg) !== -1 ||
              item.groups_name.join().search(this.searchReg) !== -1
          )
        : this.users_list
    },
    fields() {
      return [
        {
          key: 'uid',
          label: this.$t('users.tbl_header_ID'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'fullname',
          label: this.$t('users.tbl_header_name'),
          thStyle: {'max-width': '500px !important', 'text-align': 'center'},
          thClass: this.showColumn,
          tdClass: this.showColumn
        },
        {
          key: 'group_name',
          label: this.$t('users.tbl_header_group'),
          thStyle: {'text-align': 'center'},
          thClass: this.showColumn,
          tdClass: this.showColumn
        },
        {
          key: 'last_login',
          label: this.$t('users.tbl_header_last_login'),
          thStyle: {'text-align': 'center'},
          thClass: this.showColumn,
          tdClass: this.showColumn
        },
        {
          key: 'mng',
          label: this.$t('users.tbl_header_mgn'),
          thStyle: {width: '120px !important', 'text-align': 'center'}
        }
      ]
    },
    showColumn() {
      return this.is_mobile_width ? 'd-none' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';

.users-table {
  padding: 10px 0;
}
.deleted_item {
  color: $link;
}

.mng-column {
  display: flex;
  justify-content: space-around;
}
.last-login-column {
  text-align: center;
}
.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.users-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .users-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
  a {
    padding: 0 10px;
  }
}

@media screen and (max-width: 875px) {
  .users-mng-panel {
    button {
      margin-top: 15px;
      margin-left: 10px;
    }
    .users-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
