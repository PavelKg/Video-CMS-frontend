<template>
  <div class="groups-table">
    <scrollHint v-if="!scrolled && is_tablet_width && !groups_is_loading" />
    <b-table
      :items="groups_on_page"
      :fields="fields"
      responsive
      striped
      hover
      head-variant="dark"
      :busy="groups_is_loading"
      v-scroll-hint="{handler: 'onTableScrolled'}"
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="pl-2">Loading...</strong>
        </div>
      </template>
      <template #cell(name)="row">
        <b-col style="width: 25rem">
          <b-form-checkbox
            :id="row.item.gid.toString()"
            :name="`ch-${row.item.gid}`"
            :value="row.item.gid"
            v-model="groups_selected"
            :disabled="row.item.deleted_at !== ''"
            class="truncate-text"
            >{{ row.item.name }}
          </b-form-checkbox></b-col
        >
      </template>
      <template #cell(mng)="item">
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
                @click="delGroup(item.item.gid)"
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
      <a href="#" id="selectAll" @click.prevent="toggleAll">{{
        $t('label.select_all')
      }}</a>
      <span>|</span>
      <a href="#" id="deselectAll" @click.prevent="toggleAll">{{
        $t('label.deselect_all')
      }}</a>
      <button
        class="button btn-orange"
        @click="delGroups"
        :disabled="groups_selected.length === 0"
      >
        {{ $t('label.delete') }}
      </button>
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
import {mapGetters} from 'vuex'
import scrollHint from './scroll-hint'

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
      perPage: 8,
      currentPage: 1,
      groups_selected: [],
      scrolled: false
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
  components: {
    scrollHint
  },
  methods: {
    onTableScrolled() {
      this.scrolled = true
    },
    toggleAll(env) {
      const action = env.target['id']
      this.groups_selected =
        action === 'selectAll'
          ? this.groups_on_page
              .filter((group) => group.deleted_at === '')
              .map((group) => group.gid)
          : []
    },
    editGroup(group) {
      this.$emit('contentElementClick', `/hub/groups_edit/gid/${group.gid}`)
    },
    delGroup(group_gid) {
      this.$store.dispatch('GROUP_DEL', group_gid).then(
        (res) => {
          this.$emit('reloadData')
        },
        (err) => {
          this.$emit(
            'onContentError',
            `errors.${err.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      )
    },
    delGroups() {
      const deleted_groups = this.groups_selected.map(async (group_gid) => {
        try {
          await this.$store.dispatch('GROUP_DEL', group_gid)
          const ind = this.groups_selected.findIndex((gid) => gid === group_gid)
          if (ind > -1) {
            this.groups_selected.splice(ind, 1)
          }
        } catch (error) {
          console.log('error')
          this.$emit(
            'onContentError',
            `errors.${error.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      })

      Promise.all(deleted_groups).then(() => {
        this.$emit('reloadData')
      })
    },
    setPage(num) {
      this.$emit('contentElementClick', `/hub/groups/?page=${num}`)
    }
  },
  computed: {
    ...mapGetters(['groups', 'me', 'groups_is_loading', 'is_tablet_width']),
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
  justify-content: space-between;
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
      margin-left: 10px;
    }
    .groups-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
