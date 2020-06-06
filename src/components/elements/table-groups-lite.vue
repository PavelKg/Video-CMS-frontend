<template>
  <div class="groups-table">
    <span>
      {{ $t('message.number_of_registered_groups') }}: {{ groups_count }}
      {{ $t('label.groups') }}
    </span>
    <b-table
      :items="groups_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
      <template #cell(gid)="row">
        <b-form-checkbox
          :id="row.item.gid.toString()"
          :name="`ch-${row.item.gid}`"
          :value="row.item.gid"
          v-model="groups_selected"
          :disabled="row.item.deleted_at !== ''"
          class="truncate-text"
          ><a href="#" @click.prevent="onOpenGroupDetails(row.item.gid)">{{
            `g_${row.item.gid}${row.item.deleted_at !== '' ? ' (deleted)' : ''}`
          }}</a>
        </b-form-checkbox>
      </template>
      <template #cell(name)="row">
        <p class="truncate-text">{{ row.item.name }}</p>
      </template>
      <template #cell(mng)="item">
        <div class="mng-column">
          <template>
            <div class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delGroupSeries(item.item.gid)"
              /></div
          ></template>
        </div>
      </template>
    </b-table>
    <div class="groups-mng-panel">
      <div class="groups-mng-pag">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="groups_count"
          :per-page="perPage"
          align="left"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'table-groups-lite',
  props: {sid: Number},
  data() {
    return {
      fields: [
        {
          key: 'gid',
          label: this.$t('groups.tbl_header_id'),
          thStyle: {'text-align': 'center'}
        },
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
      perPage: 8,
      currentPage: 1,
      modalShow: false,
      modal_text: '',
      groups_selected: ''
    }
  },
  watch: {
    $route(newVal) {
      this.currentPage = newVal.query.page ? newVal.query.page : 1
    },
    groups_is_loading(newVal, oldVal) {
      if (!newVal) {
        this.currentPage = this.$route.query.page ? this.$route.query.page : 1
      }
    }
  },
  methods: {
    onOpenGroupDetails(group) {
      this.$emit('contentElementClick', `/groups/edit/${group}`)
    },
    delGroupSeries(gid) {
      this.$emit('deleteGroupSeries', gid)
    },

    setPage(num) {
      this.$emit('contentElementClick', `/groups/?page=${num}`)
    }
  },
  computed: {
    ...mapState({
      groups: (state) => state.Companies.Groups.list,
      //cid: (state) => state.Login.me.profile.cid,
      groups_is_loading: (state) => state.Companies.Groups.isListLoading
    }),
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

.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.groups-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  flex-wrap: wrap;
  .groups-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
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
