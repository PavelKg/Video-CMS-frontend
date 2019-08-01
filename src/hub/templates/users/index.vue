<template>
  <div class="users-mng">
    <button class="button btn-blue" @click="addNewUser">
      {{ $t('users.btn_add') }}
    </button>
    <div class="search-row">
      <b-form-input
        id="keywword_search"
        :placeholder="`${$t('label.keyword_search')}`"
        @input="handleInput('search', $event.target.value)"
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
    <UsersTable @contentElementClick="contentElementClick" @onContentError="onError" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import UsersTable from '@/components/elements/table-users'

export default {
  name: 'users-mng',
  data() {
    return {
      group_options: [],
      selected_groups: null
    }
  },
  components: {
    UsersTable
  },
  computed: {
    ...mapGetters(['groups', 'me'])
  },
  created() {
    this.$store
      .dispatch('LOAD_GROUPS', this.me.profile.company_id)
      .then(res => {
        const grpo = this.groups.map(item => {
          return {value: item.gid, text: item.name}
        })
        this.group_options = [...this.group_options, ...grpo]
      })

    this.$store.dispatch('LOAD_ROLES', this.me.profile.company_id)

    const params = {cid: this.me.profile.company_id}
    this.$store.dispatch('LOAD_USERS', params)
  },
  methods: {
    onFilter() {
      let params = {cid: this.me.profile.company_id}
      if (this.selected_groups) {
        params.filter = `group_gid[eq]: '${this.selected_groups}'`
      }
      this.$store.dispatch('LOAD_USERS', params)
    },
    addNewUser() {
      this.$store.commit('SET_ACTIVE_USER', {
        company_id: this.me.profile.company_id,
        uid: null
      })
      this.contentElementClick('root.users_add')
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
  .search-row {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
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
