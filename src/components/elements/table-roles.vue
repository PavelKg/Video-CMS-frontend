<template>
  <div class="table-roles">
    <table class="tb-roles">
      <thead>
        <tr>
          <th>
            {{ $t('roles.tbl_header_ID') }}
          </th>
          <th>
            {{ $t('roles.tbl_header_name') }}
          </th>
          <th>
            {{ $t('roles.tbl_header_auth') }}
          </th>
          <th colspan="2">
            {{ $t('roles.tbl_header_mng') }}
          </th>
        </tr>
      </thead>
      <tbody class="scrollContent">
        <tr v-for="role in roles" :key="role.rid">
          <td>
            {{ role.rid }}
          </td>
          <td>{{ role.name }}</td>
          <td align="right">{{ role.isAdmin }}</td>
          <td align="center" class="cell-icon" title="Edit">
            <img src="@/assets/images/edit_black.png" />
          </td>
          <td align="center" class="cell-icon" title="Delete">
            <img src="@/assets/images/delete_black.png" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'table-roles',
  data() {
    return {}
  },
  props: {
    Type: String
  },
  methods: {},
  computed: {
    ...mapGetters(['roles'])
  },
  components: {}
}
</script>

<style lang="scss">
.table-roles {
  .tb-roles {
    width: 100%;
    max-width: 100%;
    margin-bottom: 16px;
    margin-bottom: 1rem;
    background-color: transparent;
    border-collapse: collapse;
    overflow: hidden;
    thead {
      tr {
        position: relative;
        display: block;
      }
      th {
        width: 200px;
        padding: 10px 0;
        top: 0;
        border-bottom: 2px solid #dee2e6;
        background: #464a4f;
        color: #ffffff;
        text-align: center;
      }
      th + th {
        width: 240px;
      }

      th + th + th {
        width: 316px;
      }
    }
    tbody.scrollContent {
      display: block;
      height: 750px;
      width: 100%;
      overflow: auto;

      tr {
        background: #ffffff;
        &.second {
          background: #dcdcde;
        }
        &:hover {
          background: #bdbec1;
        }
        &.deleted {
          color: red;
        }
      }
      td {
        width: 200px;
        padding: 12px 20px;
        padding: 0.75rem;
        vertical-align: middle;
        border-top: 1px solid #dee2e6;
        .table-company-id {
          cursor: pointer;
        }
      }
      td + td {
        width: 240px;
      }

      td + td + td {
        width: 316px;
      }
    }
  }
}
</style>
