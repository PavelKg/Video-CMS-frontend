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
    this.$store.dispatch('LOAD_GROUPS', this.me.profile.company_id)
  },
  methods: {
    addNewGroup() {
      this.$store.commit('SET_ACTIVE_GROUP', {
        company_id: this.me.profile.company_id,
        gid: null
      })
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
