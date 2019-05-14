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
      <b-tabs active-tab-class="activ-tab" v-model="tabIndex">
        <b-tab
          v-for="(tab, ind) in tabs"
          :key="`dyn-tab-${tab}`"
          :title="`${tab}`"
          :title-link-class="linkClass(ind)"
          @click="changeTab"
          >
        </b-tab>
      </b-tabs>
    </div>
    <tableMessages :Type="selectedTabName" />
    <MessageModalNew
      v-if="onShowModalMessageNew"
      @close="onShowModalMessageNew = false"
    />
  </div>
</template>

<script>
import tableMessages from '@/components/elements/table-messages'
import MessageModalNew from '@/components/elements/modal-message-new'

export default {
  name: 'message-list',
  data() {
    return {
      tabs: ['Outbox', 'Inbox'],
      onShowModalMessageNew: false,
      tabIndex: 0
    }
  },
  mounted() {
    this.$store.commit('LOAD_MESSAGES', this.currentTab)
  },
  methods: {
    changeTab(evt) {
      //console.log('evt.target=', evt.target.text)
      //this.currentTab = tab
      this.$store.commit('LOAD_MESSAGES', this.currentTab)
    },
    addNewMessage() {},
    onFilter() {},
    showMessageModal() {
      this.onShowModalMessageNew = true
    },
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['bg-dark', 'text-light', 'border-dark', 'w-300']
      } else {
        return ['bg-light', 'text-info']
      }
    },

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
    MessageModalNew
  }
}
</script>

<style lang="scss" scoped>
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

.nav-item {
  width: 300px;
}
</style>
