<template>
  <div class="roles-mng">
    <div class="roles-mng-buttons">
      <button class="button btn-blue" @click="addNewRole">
        {{ $t('roles.btn_add') }}
      </button>
    </div>
    <div class="roles-mng-table">
      <TableRoles
        @contentElementClick="contentElementClick"
        @onContentError="onError"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import TableRoles from '@/components/elements/table-roles'

export default {
  name: 'roles-mng',
  data() {
    return {}
  },
  components: {
    TableRoles
  },
  created() {
    this.$store.dispatch('LOAD_ROLES', this.me.profile.company_id)
  },
  computed: {
    ...mapGetters(['me'])
  },
  methods: {
    addNewRole() {
      this.$store.commit('SET_ACTIVE_ROLE', {
        company_id: this.me.profile.company_id,
        rid: null
      })
      this.contentElementClick('root.roles_add')
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    onError(message) {
      this.$store.commit('SHOW_MESSAGE_ERROR', message)
    }
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
