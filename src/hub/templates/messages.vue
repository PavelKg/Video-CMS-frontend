<template>
  <div class="messages-zone">
    <div class="messages-mgm">
      <button class="button btn-blue" @click="addNewMessage">{{ $t('message.btn_add') }}</button>
      <div class="search-row">
        <b-form-input
          id="keywword_search"
          :placeholder="`${$t('label.keyword_search')}`"
          v-model="inputSearch"
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
        ></b-tab>
      </b-tabs>
    </div>
    <tableMessages
      :Type="selectedTabName"
      @addNewMessageByReplay="addNewMessageByReplay"
      @reloadMessages="reloadMessages"
      :searchVal="searchVal"
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
          <b-form-group
            id="select-reciever"
            :invalid-feedback="validateErrorMessage('receiver')"
            :state="validateState('receiver')"
          >
            <b-form-select v-model="modalMessData.receiver" :options="receivers">
              <template slot="first">
                <option :value="null">To</option>
              </template>
            </b-form-select>
          </b-form-group>
          <b-form-group
            id="input-subject"
            :invalid-feedback="validateErrorMessage('subject')"
            :state="validateState('subject')"
          >
            <b-form-input v-model="modalMessData.subject" :placeholder="$t('message.subject')"></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-text"
            :invalid-feedback="validateErrorMessage('text')"
            :state="validateState('text')"
          >
            <b-form-textarea
              id="textarea"
              v-model="modalMessData.text"
              :placeholder="$t('message.text')"
              wrap="hard"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>
        </div>
        <div class="modal-buttons-zone">
          <button
            class="button btn-blue"
            @click="onSubmitNewMess"
            :disabled="!isReadyToSend"
          >{{ $t('label.send') }}</button>
          <button class="button btn-braun" @click="hideMessageModal">{{ $t('label.cancel') }}</button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import tableMessages from '@/components/elements/table-messages'
import validMixin from '@/mixins/validation'

export default {
  name: 'message-list',
  mixins: [validMixin],
  data() {
    return {
      tabs: [
        {name: 'inbox', text: this.$t('message.tab_inbox')},
        {name: 'outbox', text: this.$t('message.tab_outbox')}
      ],
      isShowModalMessageAdd: false,
      tabIndex: 0,
      validFormName: 'modalMessData',
      modalMessData: {
        receiver: null,
        subject: '',
        text: '',
        imporant: false
      },
      searchVal: '',
      inputSearch: ''
    }
  },
  mounted() {
    this.reloadMessages()
    this.$store.dispatch('LOAD_MESSAGES_RECEIVERS')
  },
  methods: {
    reloadMessages() {
      this.$store
        .dispatch('LOAD_MESSAGES', {
          direction: this.tabs[this.tabIndex].name
        })
        .then(() => {
          this.$store.commit('SET_MESSAGES_IS_LOADING', false)
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
    onFilter() {
      this.searchVal = this.inputSearch
    },

    onSubmitNewMess() {
      this.$v[this.validFormName].$touch()
      if (this.$v[this.validFormName].$anyError) {
        return
      }
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
        const {cp_uid, cp_cid} = this.active_message
        this.modalMessData.receiver = {uid: cp_uid, cid: cp_cid}
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
    ...mapGetters(['message_receivers', 'active_message']),
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id,
      fieldsRestr: (store) => store.FieldRestr.categories.messages
    }),
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
    },
    isReceiverExist() {
      let recName = undefined
      if (this.modalMessData.receiver !== null) {
        recName = this.message_receivers.find(
          (receiver) => receiver.uid === this.modalMessData.receiver.uid
        )
      }
      return recName
    },
    isReadyToSend() {
      return (
        Boolean(this.isReceiverExist) &&
        this.modalMessData.subject.trim().length > 0 &&
        this.modalMessData.text.trim().length > 0
        // &&
        // Boolean(this.modalMessData.receiver)
      )
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
