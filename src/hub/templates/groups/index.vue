<template>
  <div class="groups-mng">
    <div class="button-zone">
      <button
        v-if="isActAllow('add')"
        class="button btn-blue"
        @click="addNewGroup"
      >
        {{ $t('groups.btn_add') }}
      </button>
      <b-checkbox
        class="ml-auto pt-2"
        v-model="isShowDeleted"
        @input="loadGroupsList"
      >
        {{ $t('label.show_deleted') }}
      </b-checkbox>
    </div>
    <groupsTable
      @contentElementClick="contentElementClick"
      @onContentError="onError"
      @reloadData="loadGroupsList"
    />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import groupsTable from '@/components/elements/table-groups'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'groups',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'groups',
      isShowDeleted: false
    }
  },
  created() {
    this.loadGroupsList()
  },
  methods: {
    loadGroupsList() {
      const cid = this.cid
      const filter = !this.isShowDeleted ? 'groups.deleted_at[isNull]:' : ''
      this.$store
        .dispatch('LOAD_GROUPS', {cid, filter})
        .then(() => this.$store.commit('SET_GROUPS_IS_LOADING', false))
    },
    addNewGroup() {
      this.contentElementClick('/groups/add')
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    onError(message) {
      this.$store.commit('SHOW_MESSAGE_ERROR', message)
    }
  },
  components: {
    groupsTable
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id
    })
  }
}
</script>

<style lang="scss">
.button-zone {
  display: flex;
}
</style>
