<template>
  <div class="companies-list-info">
    <div class="companies-mgm">
      <div class="search-row">
        <input
          id="keywword_search"
          placeholder="Keyword search"
          @input="handleInput('search', $event.target.value)"
        />
        <img src="@/assets/images/search_black.png" />
      </div>
      <div class="create-new blue" @click="showCompanyModalNew">Create New</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'company-list-info',
  create() {
    this.$store.commit('CREATE_COMPANY_LIST')
  },
  computed: {
    ...mapGetters(['companies_list'])
  }
}
</script>

<style lang="scss">
.companies-list-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .companies-mgm {
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
}
</style>
