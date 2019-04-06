<template>
  <div class="table-messages">
    <table class="tb-messages">
      <thead>
        <tr>
          <th v-for="(column, index) in columns_box" :key="index">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody class="scrollContent">
        <tr v-for="message in message_list" :key="message.id">
          <td align="center">
            <b-form-checkbox
              :id="String(message.id)"
              :name="`ch-${message.id}`"
            ></b-form-checkbox>
          </td>
          <td>
            <a href="#" @click="showMessageModal(message.id)">{{
              message.subject
            }}</a>
          </td>
          <td>{{ message.user }}</td>
          <td align="right">{{ message.date.toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
    <ModalMessage
      v-if="onShowModalMessageInfo"
      @close="onShowModalMessageInfo = false"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ModalMessage from './modal-message-info'

export default {
  name: 'table-messages',
  data() {
    return {
      onShowModalMessageInfo: false
    }
  },
  props: {
    Type: String
  },
  methods: {
    showMessageModal(id) {
      this.$store.commit('SET_ACTIVE_MESSAGE', id)
      this.onShowModalMessageInfo = true
    },
    messageItem() {}
  },
  computed: {
    ...mapGetters(['message_list', 'message_box_column']),
    columns_box() {
      return this.message_box_column(this.Type)
    }
  },
  components: {
    ModalMessage
  }
}
</script>

<style lang="scss">
.table-messages {
  .tb-messages {
    width: 100%;
    max-width: 100%;
    //height: 300px;
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
      height: 400px;
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
