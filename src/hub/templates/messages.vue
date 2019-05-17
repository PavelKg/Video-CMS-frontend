<template>
  <div class="messages-zone">
    <div class="messages-mgm">
      <button class="button btn-blue" @click="addNewMessage">
        {{ $t('message.btn_add') }}
      </button>
      <div class="search-row">
        <b-form-input
          id="keywword_search"
          placeholder="Keyword search"
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
        class="mytabs"
        active-tab-class="font-weight-bold text-success"
      >
        <b-tab
          v-for="(tab, ind) in tabs"
          :key="`tab-${tab}`"
          :title="`${tab}`"
          title-item-class="w-50"
          :title-link-class="linkClass(ind)"
          @click="changeTab"
        >
        </b-tab>
      </b-tabs>
    </div>
    <tableMessages
      :Type="selectedTabName"
      @addNewMessageByReplay="addNewMessageByReplay"
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
          <b-form-select
            v-model="modalMessData.receiver"
            :options="message_receivers"
          >
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
      tabs: ['Outbox', 'Inbox'],
      isShowModalMessageAdd: false,
      tabIndex: 0,
      modalMessData: {
        receiver: null,
        subject: '',
        text: '',
        users_options: []
      }
    }
  },
  mounted() {
    this.$store.dispatch('LOAD_MESSAGES', this.currentTab)
    this.$store.dispatch('LOAD_MESSAGES_RECEIVERS')
  },
  methods: {
    changeTab(evt) {
      this.$store.dispatch('LOAD_MESSAGES', this.currentTab)
    },
    addNewMessage() {
      this.showMessageModal()
    },
    addNewMessageByReplay() {
      this.showMessageModal()
    },
    onFilter() {},
    onSubmitNewMess() {
      console.log('modalMessData=', this.modalMessData)
      this.hideMessageModal()
    },
    showMessageModal() {
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
    ...mapGetters(['groups', 'me', 'message_receivers']),
    selectedTabName() {
      return this.currentTab.toLowerCase()
    },
    currentTab() {
      return this.tabs[this.tabIndex]
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
