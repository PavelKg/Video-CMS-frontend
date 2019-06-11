<template>
  <div class="table-messages">
    <b-table
      :items="messages_on_page"
      :fields="fields"
      responsive="sm"
      striped
      fixed
      hover
      head-variant="dark"
    >
      <template slot="mid" slot-scope="row">
        <div class="check-row">
          <b-form-checkbox
            :id="String(row.item.mid)"
            :name="`ch-${row.item.mid}`"
            :value="row.item.mid"
            v-model="messages_selected"
            :disabled="Boolean(row.item.deleted_at)"
          >
          </b-form-checkbox>
        </div>
      </template>
      <template slot="starred" slot-scope="data">
        <div class="star-place" @click="onStarred({mid: data.item.mid, state:data.item.starred})">
          <span class="star" :class="{selected: data.item.starred}"></span>
        </div>
      </template>
      <template slot="user" slot-scope="item">
        <div class="date-column">
          {{
            Type === 'outbox' ? item.item.receiver_uid : item.item.sender_uid
          }}
        </div>
      </template>
      <template slot="date" slot-scope="item">
        <div class="date-column">
          {{ mess_date_format(item.item.created_at) }}
        </div>
      </template>
      <template slot="subject" slot-scope="item">
        <a href="#" @click="showMessageModal(item.item)">
          {{ item.item.subject }}
        </a>
      </template>
    </b-table>
    <div class="messages-mng-panel">
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
        :disabled="messages_selected.length === 0"
      >
        {{ $t('label.delete') }}
      </button>
      <div class="messages-mng-pag">
        <b-pagination
          v-model="currentPage"
          :total-rows="messages_count"
          :per-page="perPage"
          align="left"
        ></b-pagination>
      </div>
    </div>
    <b-modal
      v-model="isShowModalMessageInfo"
      header-bg-variant="dark"
      header-text-variant="light"
      hide-footer
      centered
    >
      <div class="modal-subject">
        <div class="modal-subj-date">
          <span>{{ active_message ? active_message.subject : '' }}</span>
          <span>{{
            active_message ? mess_date_format(active_message.date) : ''
          }}</span>
        </div>
        <button class="button btn-grey" @click="replyToSender">
          {{ $t('label.reply') }}
        </button>
      </div>
      <div class="modal-text">
        {{ active_message ? active_message.text : '' }}
      </div>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'table-messages',
  data() {
    return {
      isShowModalMessageInfo: false,
      perPage: 7,
      currentPage: 1,
      messages_selected: []
    }
  },
  created() {
  },
  props: {
    Type: String
  },
  methods: {
    onStarred(payload) {
      const new_state = !payload.state 
      const action = new_state ? 'ADD': 'DEL'
      this.$store.dispatch(`${action}_MESSAGE_STAR`, payload.mid)
    },
    showMessageModal(mess) {
      this.$store.commit('SET_ACTIVE_MESSAGE', mess)
      this.isShowModalMessageInfo = true
    },
    replyToSender() {
      this.isShowModalMessageInfo = false
      this.$emit('addNewMessageByReplay')
    },
    messageItem() {},
    mess_date_format(item) {
      return item
        ? new Date(item)
            .toISOString()
            .slice(0, 19)
            .replace(/\-/gi, '/')
            .replace(/T/gi, ' ')
        : ''
    },
    toggleAll(env) {
      const action = env.target['id']
      this.messages_selected =
        action === 'selectAll'
          ? this.messages_on_page
              .filter(message => !Boolean(message.deleted_at))
              .map(item => String(item.mid))
          : []
    }
  },
  computed: {
    ...mapGetters(['messages', 'message_box_column', 'active_message', 'me']),
    messages_by_types() {
      let new_list = []
      const {company_id: cid, uid} = this.me.profile
      if (this.Type === 'outbox') {
        new_list = this.messages.filter(
          message => message.sender_uid === uid && message.sender_cid === cid
        )
      } else {
        new_list = this.messages.filter(
          message =>
            message.receiver_uid === uid && message.receiver_cid === cid
        )
      }
      return new_list
    },
    messages_count() {
      return this.messages_by_types ? this.messages_by_types.length : 0
    },
    messages_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.messages_by_types.slice(begin, end)
    },
    columns() {
      return this.message_box_column(this.Type)
    },
    fields() {
      return [
        {
          key: 'mid',
          label: '',
          thStyle: {width: '50px !important', 'text-align': 'center'}
        },
        {
          label:'#',
          key: 'starred',
          sortable: true,
          thStyle: {width: '50px !important'}
        },
        {
          key: 'subject',
          label: this.$t(`message.${this.columns[1]}`),
          sortable: true,
          thStyle: {'text-align': 'center'},
          thClass: this.showColumn,
          tdClass: this.showColumn
        },
        {
          key: `user`,
          sortable: true,
          label: this.$t(`message.${this.columns[2]}`),
          thStyle: {'text-align': 'center'}
        },
        {
          key: `date`,
          sortable: true,
          label: this.$t(`message.${this.columns[3]}`),
          thStyle: {'text-align': 'center'}
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.date-column {
  text-align: right;
}

.star-place {
  //max-width: 2px;
  //line-height: 1px;
  span {
    font-size: 1em;
  }
  display: flex;
  .star {
    cursor: pointer;
    &:before {
      color: white;
      content: '\2605';
      text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    }
  }

  .selected {
    &:before {
      content: '\2605';
      position: absolute;
      transition: all 0.4s;
      color: gold;
    }
  }
}

.check-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 50px;
}
.messages-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .messages-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
}

.modal-subject {
  display: flex;
  border-bottom: 1px solid $gray-lighter;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  .modal-subj-date {
    display: flex;
    flex-direction: column;
  }
}
.modal-text {
  padding-top: 5px;
}

@media screen and (max-width: 875px) {
  .messages-mng-panel {
    button {
      margin-top: 15px;
    }
    .messages-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
