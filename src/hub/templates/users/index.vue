<template>
  <div class="users-mng">
    <div class="button-zone">
      <button class="button btn-blue mr-2" @click="addNewUser">
        {{ $t('users.btn_add') }}
      </button>
      <button class="button btn-blue" @click="usersImport">
        {{ $t('users.btn_import') }}
      </button>
      <div class="ml-auto">
        <b-checkbox
          class="pl-5 pr-1"
          :style="{'min-width': '155px'}"
          v-model="isShowDeleted"
          @input="loadUsersList"
          name="check_isAdmin"
          inline
          >{{ $t('label.show_deleted') }}</b-checkbox
        >
      </div>
    </div>
    <div class="search-row">
      <b-form-input
        id="keywword_search"
        :placeholder="`${$t('label.keyword_search')}`"
        v-model="inputSearch"
      />
      <b-form-select v-model="selected_groups" :options="group_options">
        <template slot="first">
          <option :value="null">{{ $t('label.group') }}</option>
        </template>
      </b-form-select>
      <div class="icon-button" @click="onFilter">
        <img src="@/assets/images/search_black.png" />
      </div>
    </div>
    <UsersTable
      @contentElementClick="contentElementClick"
      @reloadData="loadUsersList"
      @onContentError="onError"
      :searchVal="searchVal"
    />
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import UsersTable from '@/components/elements/table-users'

export default {
  name: 'users-mng',
  data() {
    return {
      isShowDeleted: false,
      group_options: [],
      selected_groups: null,
      searchVal: '',
      inputSearch: ''
    }
  },
  components: {
    UsersTable
  },
  computed: {
    ...mapGetters(['groups', 'me']),
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id
    })
  },
  created() {
    const cid = this.cid
    this.$store.dispatch('LOAD_GROUPS', {cid}).then((res) => {
      this.$store.commit('SET_GROUPS_IS_LOADING', false)
      const grpo = this.groups.map((item) => {
        return {value: item.gid, text: item.name}
      })
      this.group_options = [...this.group_options, ...grpo]
    })

    this.$store.dispatch('LOAD_ROLES', {cid})
    this.loadUsersList()
  },
  methods: {
    loadUsersList() {
      const cid = this.cid
      let grpFilter = ''
      const filter = []

      if (this.selected_groups) {
        grpFilter = `user_groups[ol]:ARRAY[${this.selected_groups}]`
      }

      if (grpFilter !== '') {
        filter.push(grpFilter)
      }
      if (!this.isShowDeleted) {
        filter.push('users.deleted_at[isNull]:')
      }

      this.$store
        .dispatch('LOAD_USERS', {cid, filter: filter.join(',')})
        .then(() => this.$store.commit('SET_USERS_IS_LOADING', false))
    },
    onFilter() {
      this.searchVal = this.inputSearch

      this.loadUsersList()
    },
    addNewUser() {
      this.contentElementClick(`/users/add`)
    },
    usersImport() {
      this.contentElementClick(`/users/import`)
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    onError(message) {
      console.log('onError')
      this.$store.commit('SHOW_MESSAGE_ERROR', message)
    }
  }
}
</script>

<style lang="scss">
.users-mng {
  .button-zone {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-row {
    padding-top: 10px;
    display: flex;
    align-items: center;
    width: 100%;
    input {
      max-width: 300px;
      padding: 0 5px;
      margin-right: 10px;
    }
    select {
      max-width: 200px;
      margin-right: 10px;
    }
    img {
      width: 24px;
      height: 24px;
      margin: 0 5px;
    }
  }
}
</style>
