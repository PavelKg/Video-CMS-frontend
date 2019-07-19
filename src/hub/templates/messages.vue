<template>
  <div class="messages-zone">
    <div class="messages-mgm">
      <button class="button btn-blue" @click="addNewMessage">
        {{ $t('message.btn_add') }}
      </button>
      <div class="search-row">
        <b-form-input
          id="keywword_search"
          :placeholder="`${$t('label.keyword_search')}`"
          @input="handleInput('search', $event.target.value)"
        />
        <div class="icon-button" @click="onFilter">
          <img src="@/assets/images/search_black.png" />
        </div>
      </div>
    </div>
    <div class="messages-tabs">
      <b-tabs
        v-model="tabIndex"
        @input="changeTab"
        class="mytabs"
        active-tab-class="font-weight-bold text-success"
      >
        <b-tab
          v-for="(tab, ind) in tabs"
          :key="`tab-${tab.name}`"
          :title="`${tab.text}`"
          title-item-class="w-50"
          :title-link-class="linkClass(ind)"
        >
        </b-tab>
      </b-tabs>
    </div>
    <tableMessages
      :Type="selectedTabName"
      @addNewMessageByReplay="addNewMessageByReplay"
      @reloadMessages="reloadMessages"
    />
    <b-modal
      v-model="isShowModalMessageAdd"
      header-bg-variant="dark"
      header-text-variant="light"
      hide-footer
      centered
      @hidden="hiddenModal"
    >
      <div class="modal-zone">
        <div class="modal-data-zone">
          <b-form-select v-model="modalMessData.receiver" :options="receivers">
            <template slot="first">
              <option :value="null">To</option>
            </template>
          </b-form-select>
          <p></p>
          <b-form-input
            v-model="modalMessData.subject"
            :placeholder="$t('message.subject')"
          ></b-form-input>
          <p></p>
          <b-form-textarea
            id="textarea"
            v-model="modalMessData.text"
            :placeholder="$t('message.text')"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </div>
        <div class="modal-buttons-zone">
          <button class="button btn-blue" @click="onSubmitNewMess">
            {{ $t('label.send') }}
          </button>
          <button class="button btn-braun" @click="hideMessageModal">
            {{ $t('label.cancel') }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import tableMessages from '@/components/elements/table-messages'

export default {
  name: 'message-list',
  data() {
    return {
      tabs: [
        {name: 'inbox', text: this.$t('message.tab_inbox')},
        {name: 'outbox', text: this.$t('message.tab_outbox')}
      ],
      isShowModalMessageAdd: false,
      tabIndex: 0,
      modalMessData: {
        receiver: null,
        subject: '',
        text: '',
        imporant: false
      }
    }
  },
  mounted() {
    this.reloadMessages()
    this.$store.dispatch('LOAD_MESSAGES_RECEIVERS')
  },
  methods: {
    reloadMessages() {
      this.$store.dispatch('LOAD_MESSAGES', {
        direction: this.tabs[this.tabIndex].name
      })
    },
    changeTab(evt) {
      this.reloadMessages()
    },
    addNewMessage() {
      this.$store.commit('SET_ACTIVE_MESSAGE', null)
      this.showMessageModal()
    },
    addNewMessageByReplay() {
      this.showMessageModal()
    },
    onFilter() {},

    onSubmitNewMess() {
      const {receiver, subject, text, imporant} = this.modalMessData
      const messData = {
        receiver_uid: receiver.uid,
        receiver_cid: receiver.cid,
        subject,
        text,
        imporant
      }
      this.$store.dispatch('MESSAGE_ADD', messData).then(
        (res) => {
          this.reloadMessages()
        },
        (err) => {
          console.log('err=', err)
        }
      )
      this.hideMessageModal()
    },
    showMessageModal() {
      if (this.active_message) {
        const {receiver_uid, receiver_cid} = this.active_message
        this.modalMessData.receiver = {uid: receiver_uid, cid: receiver_cid}
      }
      this.isShowModalMessageAdd = true
    },
    hideMessageModal() {
      this.isShowModalMessageAdd = false
    },
    hiddenModal() {
      this.modalMessData = {
        ...this.modalMessData,
        receiver: null,
        subject: '',
        text: ''
      }
    },
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['text-light', 'border-dark']
      } else {
        return ['text-light']
      }
    },
    itemClass() {
      return ['tab-item']
    }
  },
  computed: {
    ...mapGetters(['me', 'message_receivers', 'active_message']),
    selectedTabName() {
      return this.currentTab.toLowerCase()
    },
    currentTab() {
      return this.tabs[this.tabIndex].name
    },
    receivers() {
      return this.message_receivers.map((receiver) => {
        return {
          value: {uid: receiver.uid, cid: receiver.cid},
          text: receiver.uid
        }
      })
    }
  },
  components: {
    tableMessages
  }
}
</script>

<style lang="scss">
.messages-mgm {
  .search-row {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    input {
      max-width: 300px;
      padding: 0 5px;
      margin-right: 10px;
    }
    select {
      max-width: 200px;
      margin-right: 10px;
    }
    img {
      width: 24px;
      height: 24px;
      margin: 0 5px;
    }
  }
}
.messages-tabs {
  padding-top: 15px;
}

.modal-zone {
  .modal-buttons-zone {
    display: flex;
    padding-top: 10px;
    .button {
      margin-right: 10px;
    }
  }
}

.tabs.mytabs .nav-tabs .nav-item {
  max-width: 300px;
  .nav-link {
    background: rgb(118, 113, 113);
  }
  .active {
    background: #343a40;
  }
}
</style>
