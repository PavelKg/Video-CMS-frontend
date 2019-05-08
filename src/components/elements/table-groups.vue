<template>
  <div class="groups-table">
    <b-table
      :items="groups_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
    >
      <template slot="name" slot-scope="row">
        <b-form-checkbox
          :id="row.item.gid"
          :name="`ch-${row.item.gid}`"
          :value="row.item.gid"
          v-model="groups_selected"
          :disabled="row.item.deleted_at !== ''"
          >{{ row.item.name }}
        </b-form-checkbox>
      </template>
      <template slot="mng" slot-scope="row">
        <img src="@/assets/images/edit_black.png" />
        <img src="@/assets/images/delete_black.png" />
        </template
    ></b-table>
    <div class="groups-mng-panel">
      <span>{{ $t('groups.in_page') }}:</span>
      <a href="#" id="selectAll" @click="toggleAll">{{
        $t('label.select_all')
      }}</a>
      <span>|</span>
      <a href="#" id="deselectAll" @click="toggleAll">{{
        $t('label.deselect_all')
      }}</a>
      <button
        class="button btn-orange"
        :disabled="groups_selected.length === 0"
      >
        {{ $t('label.delete') }}
      </button>
      <div class="groups-mng-pag">
        <b-pagination
          v-model="currentPage"
          :total-rows="groups_count"
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
  name: 'table-groups',
  data() {
    return {
      fields: [{key: 'name', label: 'Name'}, 'mng'],
      perPage: 2,
      currentPage: 1,
      groups_selected: []
    }
  },
  methods: {
    toggleAll(env) {
      console.log('groups_selected=', this.groups_selected)
      const action = env.target['id']
      this.groups_selected =
        action === 'selectAll'
          ? this.groups_on_page
              .filter(group => group.deleted_at === '')
              .map(item => String(item.gid))
          : []
    },
    editGroup(group) {
      this.$store.commit('SET_ACTIVE_GROUP', group)
      this.$emit(
        'contentElementClick',
        'root.subItems.groups.subItems.group_edit'
      )
    },
    delGroup(group) {
      this.$store.commit('SET_ACTIVE_GROUP', group)
      this.$store.dispatch('GROUP_DEL').then(
        res => {
          this.$store.dispatch('LOAD_GROUPS', this.me.profile.company_id)
        },
        err => {
          console.log('err=', err)
        }
      )
    }
  },
  computed: {
    ...mapGetters(['groups', 'me']),
    groups_count() {
      return this.groups ? this.groups.length : 0
    },
    groups_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.groups.slice(begin, end)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.groups-table {
  padding: 10px 0;
}

.deleted_item {
  color: $link;
}
.groups-mng-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  .groups-mng-pag {
    display: flex;
    //margin-left: auto;
    > * {
      margin-bottom: 0;
    }
  }
  a {
    padding: 0 10px;
  }
}

@media screen and (max-width: 875px) {
  .groups-mng-pag {
    width: 100%;
  }
}
</style>
