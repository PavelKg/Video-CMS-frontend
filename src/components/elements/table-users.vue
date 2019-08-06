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
    >
      <template slot="uid" slot-scope="row">
        <b-form-checkbox
          :id="row.item.uid"
          :name="`ch-${row.item.uid}`"
          :value="row.item.uid"
          v-model="users_selected"
          :disabled="row.item.deleted_at !== ''"
          >{{ row.item.uid }}
        </b-form-checkbox>
      </template>
      <template slot="last_login" slot-scope="item">
        <div class="last-login-column">
          {{ last_login_format(item.item.last_login) }}
        </div>
      </template>
      <template slot="fullname" slot-scope="item"
        ><div class="name-column">{{ item.item.fullname }}</div>
      </template>
      <template slot="mng" slot-scope="item">
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
      <a href="#" id="selectAll" @click="toggleAll">{{
        $t('label.select_all')
      }}</a>
      <span>|</span>
      <a href="#" id="deselectAll" @click="toggleAll">{{
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
import {mapGetters} from 'vuex'

export default {
  name: 'table-users',
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      users_selected: []
    }
  },
  created() {},
  watch: {
    $route(newVal) {
      this.currentPage = newVal.query.page ? newVal.query.page : 1
    },
    users_is_loading(newVal, oldVal) {
      if (!newVal) {
        this.currentPage = this.$route.query.page ? this.$route.query.page : 1
      }
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
      return item
        ? new Date(item)
            .toISOString()
            .slice(0, 10)
            .replace(/\-/gi, '/')
        : ''
    },
    editUser(userProp) {
      // this.$store.commit('SET_ACTIVE_USER', {
      //   company_id: this.me.profile.company_id,
      //   ...userProp
      // })
      const {cid, uid} = userProp
      this.$emit('contentElementClick', `/hub/users_edit/uid/${uid}`)
    },
    delUser(item) {
      this.$store.dispatch('USER_DEL', item.uid).then(
        (res) => {
          this.$store
            .dispatch('LOAD_USERS', {cid: this.me.profile.company_id})
            .then(() => this.$store.commit('SET_USERS_IS_LOADING', false))
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
          this.$store
            .dispatch('LOAD_USERS', {cid: this.me.profile.company_id})
            .then(() => this.$store.commit('SET_USERS_IS_LOADING', false))
        },
        (err) => {}
      )
    },
    setPage(num) {
      this.$emit('contentElementClick', `/hub/users/?page=${num}`)
    }
  },
  computed: {
    ...mapGetters(['users_list', 'me', 'is_mobile_width', 'users_is_loading']),
    users_count() {
      return this.users_list ? this.users_list.length : 0
    },
    users_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.users_list.slice(begin, end)
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
    }
    .users-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
