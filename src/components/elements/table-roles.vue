<template>
  <div class="roles-table">
    <scrollHint v-if="!scrolled && is_tablet_width && !roles_is_loading" />
    <b-table
      :items="roles_on_page"
      :fields="fields"
      responsive
      striped
      hover
      head-variant="dark"
      :busy="roles_is_loading"
      v-scroll-hint="{handler: 'onTableScrolled'}"
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="pl-2">Loading...</strong>
        </div>
      </template>
      <template #cell(is_admin)="item">
        <p style="text-align: center">
          {{ item.item.is_admin ? $t('label.yes') : $t('label.no') }}
        </p>
      </template>
      <template #cell(rid)="item">
        <b-col style="width: 25rem">
          <b-form-checkbox
            :id="item.item.rid.toString()"
            :name="`ch-${item.item.rid}`"
            :value="item.item.rid"
            v-model="roles_selected"
            :disabled="item.item.deleted_at !== ''"
            class="truncate-text"
          >
            {{ item.item.rid }}
          </b-form-checkbox></b-col
        >
      </template>
      <template #cell(name)="item">
        <b-col style="width: 25rem">
          <p class="truncate-text">
            {{ item.item.name }}
          </p>
        </b-col>
      </template>
      <template #cell(mng)="item">
        <div class="mng-column">
          <template v-if="item.item.deleted_at === ''">
            <div class="icon-button">
              <img
                src="@/assets/images/edit_black.png"
                @click="editRole(item.item)"
              />
            </div>
            <div class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delRole(item.item)"
              /></div
          ></template>
          <template v-else>
            {{ $t('roles.tbl_deleted') }}
          </template>
        </div>
      </template>
    </b-table>
    <div class="roles-mng-panel">
      <span>{{ $t('roles.in_page') }}:</span>
      <a href="#" id="selectAll" @click.prevent="toggleAll">{{
        $t('label.select_all')
      }}</a>
      <span>|</span>
      <a href="#" id="deselectAll" @click.prevent="toggleAll">{{
        $t('label.deselect_all')
      }}</a>
      <button
        class="button btn-orange"
        @click="delRoles"
        :disabled="roles_selected.length === 0"
      >
        {{ $t('label.delete') }}
      </button>
      <div class="roles-mng-pag">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="roles_count"
          :per-page="perPage"
          align="left"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import scrollHint from './scroll-hint'

export default {
  name: 'table-roles',
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      scrolled: false,
      roles_selected: []
    }
  },
  watch: {
    $route(newVal) {
      const page = +newVal.query.page
      this.currentPage = page ? page : 1
    },
    roles_is_loading(newVal, oldVal) {
      const page = +this.$route.query.page
      if (!newVal) {
        this.currentPage = page ? page : 1
      }
    }
  },
  methods: {
    onTableScrolled() {
      this.scrolled = true
    },
    editRole(role) {
      const {rid} = role
      this.$emit('contentElementClick', `/hub/roles_edit/rid/${rid}`)
    },
    delRole(role) {
      const {rid} = role
      const cid = this.cid
      this.$store.dispatch('ROLE_DEL', rid).then(
        (res) => {
          this.$emit('reloadData')
        },
        (err) => {
          console.log('err.message=', err)
          this.$emit(
            'onContentError',
            `errors.${err.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      )
    },
    delRoles() {
      const deleted_roles = this.roles_selected.map(async (role_rid) => {
        try {
          await this.$store.dispatch('ROLE_DEL', role_rid)
          const ind = this.roles_selected.findIndex((rid) => rid === role_rid)
          if (ind > -1) {
            this.roles_selected.splice(ind, 1)
          }
        } catch (error) {
          this.$emit(
            'onContentError',
            `errors.${error.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      })

      Promise.all(deleted_roles).then(() => {
        this.$emit('reloadData')
      })
    },
    setPage(num) {
      if (num === this.currentPage) {
        return
      } else {
        this.$emit('contentElementClick', `/hub/roles/?page=${num}`)
      }
    },
    toggleAll(env) {
      const action = env.target['id']
      this.roles_selected =
        action === 'selectAll'
          ? this.roles_on_page
              .filter((role) => role.deleted_at === '')
              .map((role) => role.rid)
          : []
    }
  },
  computed: {
    ...mapGetters(['roles', 'roles_is_loading', 'is_tablet_width']),
    ...mapState({
      cid: (state) => state.Login.me.profile.company_id
    }),
    roles_count() {
      return this.roles ? this.roles.length : 0
    },
    roles_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.roles.slice(begin, end)
    },
    fields() {
      return [
        {
          key: 'rid',
          label: this.$t('roles.tbl_header_ID'),
          thStyle: {'text-align': 'center', 'vertical-align': 'middle'}
        },
        {
          key: 'name',
          label: this.$t('roles.tbl_header_name'),
          thStyle: {'text-align': 'center', 'vertical-align': 'middle'},
          thClass: this.showColumn,
          tdClass: this.showColumn
        },
        {
          key: 'is_admin',
          label: !this.showColumn ? this.$t('roles.tbl_header_auth') : 'Admin',
          thStyle: {
            'text-align': 'center',
            'max-width': '10rem',
            'vertical-align': 'middle'
          }
        },
        {
          key: 'mng',
          label: this.$t('roles.tbl_header_mng'),
          thStyle: {
            width: '120px !important',
            'text-align': 'center',
            'vertical-align': 'middle'
          }
        }
      ]
    },
    showColumn() {
      //return this.is_mobile_width ? 'd-none' : ''
      return ''
    }
  },
  components: {
    scrollHint
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';

.roles-table {
  //position: relative;
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

.roles-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .roles-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 875px) {
  .roles-mng-panel {
    button {
      margin-top: 15px;
    }
    .roles-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
