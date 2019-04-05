<template>
  <div class="messages-zone">
    <div class="messages-mgm">
      <div class="search-row">
        <input
          id="keywword_search"
          placeholder="Keyword search"
          @input="handleInput('search',$event.target.value)"
        >
        <img src="@/assets/images/search_black.png">
      </div>
      <div class="create-new blue" @click="showMessageModal">Create New</div>
    </div>
    <div class="messages-tabs">
      <button
        v-for="tab in tabs"
        v-bind:key="tab.name"
        v-bind:class="['tab-button', { active: currentTab.name === tab.name }]"
        v-on:click="select_tab(tab)"
      >{{ tab.name }}</button>
    </div>
    <tableMessages :Type="selectedTabName"/>
    <MessageModalNew v-if="onShowModalMessageNew" @close="onShowModalMessageNew = false"/>
  </div>
</template>

<script>
import tableMessages from '@/components/elements/table-messages'
import MessageModalNew from '@/components/elements/modal-message-new'

export default {
  name: 'message-list',
  data() {
    return {
      tabs: [{name: 'Outbox'}, {name: 'Inbox'}],
      currentTab: {name: 'Outbox'},
      onShowModalMessageNew: false
    }
  },
  mounted() {
    this.$store.commit('GET_MESSAGES', this.currentTab.name)
  },
  methods: {
    select_tab(tab) {
      this.currentTab = tab
      this.$store.commit('GET_MESSAGES', this.currentTab.name)
    },
    showMessageModal() {
      this.onShowModalMessageNew = true
    },
  },
  computed: {
    selectedTabName() {
      return this.currentTab.name.toLowerCase()
    }
  },
  components: {
    tableMessages,
    MessageModalNew
  }
}
</script>

<style lang="scss" scoped>
.messages-zone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .messages-mgm {
    display: flex;
    flex-direction: row;
    align-items: center;
    .search-row {
      padding: 10px 0;
      display: flex;
      flex-direction: row;
      input {
        padding: 0 10px;
        margin: 0 10px;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
    .create-new {
      display: flex;
      margin-left: auto;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 150px;
      height: 30px;
      color: #ffffff;
    }
    .blue {
      background: #4472c4;
    }
  }
  .messages-tabs {
    padding-top: 20px;
    display: flex;
    flex-direction: row;
    .tab-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 300px;
      height: 40px;
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      border-right: 2px solid #ccc;
      border-bottom: 1px solid #ccc;
      cursor: pointer;
      background: #999;
      margin-bottom: -1px;
      margin-right: -1px;
    }
    .tab-button:hover {
      background: #464a4f;
    }
    .tab-button.active {
      background: #464a4f;
    }
  }
}
</style>

