<template>
  <div class="table-roles">
    <b-table
      :items="roles"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
      <template slot="is_admin" slot-scope="item">
        <div style="text-align: center">
          {{ item.item.is_admin ? $t('label.yes') : $t('label.no') }}
        </div>
      </template>
      <template slot="mng" slot-scope="item">
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
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'table-roles',
  data() {
    return {
      perPage: 4,
      currentPage: 1,
      roles_selected: []
    }
  },
  methods: {
    editRole(role) {
      const {rid} = role
      this.$emit('contentElementClick', `/hub/roles_edit/rid/${rid}`)
    },
    delRole(role) {
      const {rid} = role
      const cid = this.me.profile.company_id
      this.$store.dispatch('ROLE_DEL', rid).then(
        (res) => {
          this.$store.dispatch('LOAD_ROLES', cid)
        },
        (err) => {
          this.$emit(
            'onContentError',
            `errors.${err.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      )
    }
  },
  computed: {
    ...mapGetters(['roles', 'roles_is_list_loading', 'me', 'is_mobile_width']),
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
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'name',
          label: this.$t('roles.tbl_header_name'),
          thStyle: {'text-align': 'center'},
          thClass: this.showColumn,
          tdClass: this.showColumn
        },
        {
          key: 'is_admin',
          label: !this.showColumn
            ? this.$t('roles.tbl_header_auth')
            : 'Is Admin',
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'mng',
          label: this.$t('roles.tbl_header_mng'),
          thStyle: {width: '120px !important', 'text-align': 'center'}
        }
      ]
    },
    showColumn() {
      return this.is_mobile_width ? 'd-none' : ''
    }
  },
  components: {}
}
</script>

<style lang="scss">
@import '../../assets/styles';

.deleted_item {
  color: $link;
}

.mng-column {
  display: flex;
  justify-content: space-around;
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
  a {
    padding: 0 10px;
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
