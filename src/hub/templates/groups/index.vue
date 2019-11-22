<template>
  <div class="groups-mng">
    <button class="button btn-blue" @click="addNewGroup">
      {{ $t('groups.btn_add') }}
    </button>
    <groupsTable
      @contentElementClick="contentElementClick"
      @onContentError="onError"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import groupsTable from '@/components/elements/table-groups'

export default {
  name: 'groups-mng',
  created() {
    this.$store
      .dispatch('LOAD_GROUPS', {cid: this.me.profile.company_id})
      .then(() => this.$store.commit('SET_GROUPS_IS_LOADING', false))
  },
  methods: {
    addNewGroup() {
      this.contentElementClick('/hub/groups_add')
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
    ...mapGetters(['me'])
  }
}
</script>

<style lang="scss"></style>
