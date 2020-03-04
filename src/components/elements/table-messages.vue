<template>
  <div class="table-messages">
    <scrollHint v-if="!scrolled && is_tablet_width && !messages_is_loading" />
    <b-table
      :items="messages_on_page"
      :fields="fields"
      responsive
      striped
      hover
      no-local-sorting
      @sort-changed="sortingChanged"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      head-variant="dark"
      :busy="messages_is_loading"
      v-scroll-hint="{handler: 'onTableScrolled'}"
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="pl-2">Loading...</strong>
        </div>
      </template>
      <template #cell(mid)="row">
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
      <template #cell(starred)="data">
        <div
          class="star-place"
          @click="onStarred({mid: data.item.mid, state: data.item.starred})"
        >
          <span class="star" :class="{selected: data.item.starred}"></span>
        </div>
      </template>
      <template #cell(cp_uid)="item">
        <p class="date-column truncate-text">
          {{ item.item.cp_uid }}
        </p>
      </template>
      <template #cell(created_at)="item">
        <p class="date-column truncate-text">
          {{ mess_date_format(item.item.created_at) }}
        </p>
      </template>
      <template #cell(subject)="item">
        <b-col style="width: 15rem">
          <a href="#" @click.prevent="showMessageModal(item.item)">
            <p class="truncate-text">{{ item.item.subject }}</p>
          </a></b-col
        >
      </template>
    </b-table>
    <div class="messages-mng-panel">
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
        :disabled="messages_selected.length === 0"
        @click="onDeleteMessages"
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
          <div class="subject-title-row">
            <span class="title">{{ $t('message.subject') }}</span>
            <template v-if="active_message && !active_message.cp_deleted_at">
              <button class="button btn-grey" @click="replyToSender">
                {{ $t('label.reply') }}
              </button>
            </template>
          </div>

          <p
            class="b-text"
            v-html="active_message ? active_message.subject : ''"
          ></p>
          <p
            class="b-text"
            v-html="
              active_message ? mess_date_format(active_message.created_at) : ''
            "
          ></p>
        </div>
      </div>
      <span class="title">{{ $t('message.text') }}</span>
      <p
        class="b-text"
        v-html="`${active_message ? active_message.text : ''}`"
      ></p>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import scrollHint from './scroll-hint'

export default {
  name: 'table-messages',
  data() {
    return {
      isShowModalMessageInfo: false,
      perPage: 7,
      currentPage: 1,
      messages_selected: [],
      sortBy: 'created_at',
      sortDesc: false,
      searchReg: undefined,
      scrolled: false
    }
  },
  props: {
    Type: String,
    searchVal: String
  },
  watch: {
    Type(newval, oldval) {
      this.sortBy = 'created_at'
      this.sortDesc = false
      this.messages_selected = []
    },
    searchVal(newVal) {
      this.searchReg = newVal !== '' ? new RegExp(`${newVal}`, 'ig') : undefined
    }
  },
  components: {
    scrollHint
  },
  methods: {
    onTableScrolled() {
      this.scrolled = true
    },
    sortingChanged(ctx) {
      const {sortBy, sortDesc} = ctx
      this.$store.commit('ORDER_MESSAGE', {sortBy, sortDesc})
    },
    onStarred(payload) {
      const new_state = !payload.state
      const action = new_state ? 'ADD' : 'DEL'
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
        ? item
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
              .filter((message) => !Boolean(message.deleted_at))
              .map((item) => String(item.mid))
          : []
    },
    onDeleteMessages() {
      const direction = this.Type
      const deleted_messages = Promise.all(
        this.messages_selected.map(async (mid) => {
          return await this.$store.dispatch('MESSAGE_DEL', {direction, mid})
        })
      )
      deleted_messages.then(
        (res) => {
          this.messages_selected = []
          this.$emit('reloadMessages')
        },
        (error) => {
          throw Error(error)
        }
      )
    }
  },
  computed: {
    ...mapGetters([
      'messages',
      'messages_box_column',
      'active_message',
      'is_tablet_width'
    ]),
    ...mapState({
      cid: (state) => state.Login.me.profile.company_id,
      messages_is_loading: (state) => state.Messages.isListLoading
    }),
    queriedMessages() {
      return Boolean(this.searchReg)
        ? this.messages.filter(
            (item) =>
              item.cp_cname.search(this.searchReg) !== -1 ||
              item.subject.search(this.searchReg) !== -1
          )
        : this.messages
    },

    messages_count() {
      return this.queriedMessages ? this.queriedMessages.length : 0
    },
    messages_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.queriedMessages.slice(begin, end)
    },
    columns() {
      return this.messages_box_column(this.Type)
    },
    fields() {
      return [
        {
          key: 'mid',
          label: '',
          thStyle: {width: '2em !important', 'text-align': 'center'}
        },
        {
          label: '#',
          key: 'starred',
          sortable: true,
          thStyle: {width: '3.5rem !important'}
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
          key: 'cp_uid',
          sortable: true,
          label: this.$t(`message.${this.columns[2]}`),
          thStyle: {'text-align': 'center'}
        },
        {
          key: `created_at`,
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

.custom-control {
  padding-left: 3rem;
}

.date-column {
  text-align: right;
}

.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
      //position: absolute;
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

.b-text {
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-top: 5px;
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
    width: 100%;
    .subject-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
span.title {
  color: $link;
  padding-bottom: 3px;
  white-space: pre-wrap;
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
