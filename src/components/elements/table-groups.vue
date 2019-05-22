<template>
  <div class="groups-table">
    <b-table
      :items="groups_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
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
      <template slot="mng" slot-scope="item">
        <div class="mng-column">
          <template v-if="item.item.deleted_at === ''">
            <div class="icon-button">
              <img
                src="@/assets/images/edit_black.png"
                @click="editGroup(item.item)"
              />
            </div>
            <div class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delGroup(item.item)"
              /></div
          ></template>
          <template v-else>
            {{ $t('groups.tbl_deleted') }}
          </template>
        </div>
      </template>
    </b-table>
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
      fields: [
        {
          key: 'name',
          label: this.$t('groups.tbl_header_name'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'mng',
          label: this.$t('groups.tbl_header_mgn'),
          thStyle: {width: '120px !important', 'text-align': 'center'}
        }
      ],
      perPage: 4,
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
      const params = {
        cid: this.me.profile.company_id,
        filter: `group_gid[eq]:'${group.gid}'`
      }
      this.$store.dispatch('LOAD_USERS', params)
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
          console.log(this.groups)
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

.mng-column {
  display: flex;
  justify-content: space-around;
}

.groups-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .groups-mng-pag {
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
  .groups-mng-panel {
    button {
      margin-top: 15px;
    }
    .groups-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
