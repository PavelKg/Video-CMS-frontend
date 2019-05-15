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
    <tableMessages :Type="selectedTabName" />
    <modalAddMessage :isShowModal="isShowModalMessageAdd" />
  </div>
</template>

<script>
import tableMessages from '@/components/elements/table-messages'
import modalAddMessage from '@/components/elements/modal-message-new.vue'

export default {
  name: 'message-list',
  data() {
    return {
      tabs: ['Outbox', 'Inbox'],
      isShowModalMessageAdd: false,
      tabIndex: 0
    }
  },
  mounted() {
    this.$store.dispatch('LOAD_MESSAGES', this.currentTab)
  },
  methods: {
    changeTab(evt) {
      //console.log('evt.target=', evt.target.text)
      //this.currentTab = tab
      this.$store.dispatch('LOAD_MESSAGES', this.currentTab)
    },
    addNewMessage() {
      this.isShowModalMessageAdd = true
    },
    onFilter() {},
    showMessageModal() {
      this.onShowModalMessageNew = true
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
    selectedTabName() {
      return this.currentTab.toLowerCase()
    },
    currentTab() {
      return this.tabs[this.tabIndex]
    }
  },
  components: {
    tableMessages,
    modalAddMessage
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
