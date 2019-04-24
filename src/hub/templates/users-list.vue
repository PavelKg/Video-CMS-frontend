<template>
  <div class="users-mng">
    <button class="button btn-blue">
      {{ $t('users.btn_add') }}
    </button>
    <div class="search-row">
      <input
        id="keywword_search"
        placeholder="Keyword search"
        @input="handleInput('search', $event.target.value)"
      />
      <img src="@/assets/images/search_black.png" />
    </div>
    <UsersTable />
  </div>
</template>

<script>
import UsersTable from '@/components/elements/table-users'

export default {
  name: 'users-mng',
  components: {
    UsersTable
  }
}
</script>

<style lang="scss">
.users-mng {
  .search-row {
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    input {
      padding: 0 0px;
      margin: 0 0px;
    }
    img {
      width: 24px;
      height: 24px;
      margin: 0 5px;
    }
  }
}
</style>
