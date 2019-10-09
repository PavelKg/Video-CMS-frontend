<template>
  <div class="history-info">
    <p class="history-title">
      {{ $t('history.history_title') }}
    </p>
    <div class="history-filter-row">
      <p class="row-title">{{ $t('history.period') }} :</p>
      <datetime
        class="datepicker"
        format="YYYY-MM-DD h:i"
        :readonly="true"
        v-model="date_from"
      ></datetime>
      <p class="row-space">~</p>
      <datetime
        class="datepicker"
        format="YYYY-MM-DD h:i"
        :readonly="true"
        v-model="date_to"
      ></datetime>
    </div>
    <div class="history-filter-row">
      <p class="row-title">{{ $t('history.target_content') }} :</p>
      <multiselect
        id="ms-categories"
        v-if="!isCategoriesLoading"
        class="multiselect"
        v-model="categories_selected"
        :cleanSelected="cleanSelectedCategories"
        @cleaned="msCleaned('cleanSelectedCategories')"
        :items="categories_list"
        :placeholder="`${$t('history.object_type_not_selected')}`"
      />
      <p class="row-space"></p>
      <multiselect
        class="multiselect"
        id="ms-category-object"
        v-model="objects_selected"
        :disabled="isCategoryObjectLoading"
        :items="objects_list"
        :placeholder="`${$t('history.object_name_not_selected')}`"
      />
    </div>
    <div class="history-filter-row">
      <p class="row-title">{{ $t('history.user_id') }} :</p>
      <multiselect
        id="ms-users"
        class="multiselect"
        v-model="users_selected"
        :cleanSelected="cleanSelectedUsers"
        @cleaned="msCleaned('cleanSelectedUsers')"
        :items="users_list"
        :placeholder="`${$t('history.not_selected')}`"
      />
      <div class="filter-button">
        <button
          class="button btn-blue"
          :disabled="!onReadyToExtract"
          @click="onExtraction"
        >
          {{ $t('label.extraction') }}
        </button>
        <button class="button btn-braun" @click="onResetFilter">
          {{ $t('label.reset') }}
        </button>
      </div>
    </div>
    <div class="history-table">
      <tableHistoryInfo @contentElementClick="contentElementClick" />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import multiselect from '@/components/elements/multiselect'
import datetime from '@/components/elements/datetimepicker'
import tableHistoryInfo from '@/components/elements/table-history'

export default {
  data() {
    return {
      date_from: '',
      date_to: new Date().toLocalDateString().slice(0, 16),
      categories_list: [],
      categories_selected: [],
      isCategoriesLoading: true,
      cleanSelectedCategories: false,

      objects_list: [],
      objects_selected: [],
      isCategoryObjectLoading: true,

      users_list: [],
      users_selected: [],
      cleanSelectedUsers: false
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.query !== oldVal.query) {
        this.updateProc(newVal.query)
      }
    },
    categories_selected(newVal) {
      this.updateCategoryObjectsList()
    }
  },

  created() {
    const query = this.$route.query
    this.updateProc(query)

    this.$store.dispatch('LOAD_HISTORY_CATEGORIES', {}).then((res) => {
      if (Array.isArray(res)) {
        const items = res
          .filter((item) => item !== null && item !== '')
          .map((item) => {
            return {value: item, text: item}
          })
        this.categories_list = [...items]
        this.isCategoriesLoading = false
      }
    })

    this.$store
      .dispatch('LOAD_USERS', {cid: this.me.profile.company_id})
      .then(() => {
        this.$store.commit('SET_USERS_IS_LOADING', false)
        const uids = this.users
          .filter((user) => user.deleted_at === '')
          .map((user) => {
            return {value: user.uid, text: user.uid}
          })
        this.users_list = [...uids]
      })
  },
  methods: {
    updateCategoryObjectsList() {
      this.objects_selected = []
      if (this.categories_selected.length === 0) {
        this.objects_list = []
      } else {
        this.isCategoryObjectLoading = true
        this.$store
          .dispatch('LOAD_HISTORY_OBJECTS', {
            categories: this.categories_selected.join(',')
          })
          .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
              const items = res
                .filter((item) => item !== null)
                .map((item) => {
                  return {value: item, text: item}
                })
              this.objects_list = [...items]
            } else {
              this.objects_list = []
            }
            this.isCategoryObjectLoading = false
          })
      }
    },
    onCategoryObjectsListState(state) {
      if (state === 'opened') {
      }
    },
    onResetFilter() {
      this.cleanSelectedCategories = true
      this.cleanSelectedUsers = true

      this.$router.push({path: this.$route.path})
    },
    msCleaned(name) {
      this[name] = false
    },
    onExtraction() {
      const categories = this.categories_selected.join(',')
      const objects = this.objects_selected.join(',')
      const users = this.users_selected.join(',')
      const from = this.date_from
      const to = this.date_to
      this.updatePageByFilters({categories, objects, users, from, to})
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    updateProc(query) {
      this.categories_selected = []
      this.objects_selected = []
      this.users_selected = []

      for (const key in query) {
        switch (key) {
          case 'categories':
            this.categories_selected = query[key].split(',')
            break
          case 'objects':
            this.objects_selected = query[key].split(',')
            break
          case 'users':
            this.users_selected = query[key].split(',')
            break
          case 'from':
            this.date_from = query[key]
            break
          case 'to':
            this.date_to = query[key]
            break
          default:
            break
        }
      }

      if (!query.date_from) {
        this.$store.dispatch('GET_MY_COMPANY_INFO').then((res) => {
          const created = new Date(res.created_at)
            .toLocalDateString()
            .slice(0, 16)
          this.date_from = created
        })
      }

      if (
        this.categories_selected.length > 0 &&
        this.objects_selected.length > 0 &&
        this.users_selected.length > 0
      ) {
        this.$store.dispatch('LOAD_HISTORY_LIST', {
          constraints: {
            date_from: this.date_from,
            date_to: this.date_to,
            categories: `'${this.categories_selected.join("'\\,'")}'`,
            objects: `'${this.objects_selected.join("'\\,'")}'`,
            users: `'${this.users_selected.join("'\\,'")}'`
          }
        })
      } else {
        this.$store.commit('CLEAR_HISTORY_LIST_DATA')
      }
    },
    updatePageByFilters(params) {
      let sendQuery = {...this.$route.query}
      if (typeof params === 'object') {
        for (let param in params) {
          sendQuery[param] = params[param]
        }
      } else {
      }
      sendQuery['page'] = 1
      this.$router.push({path: this.$route.path, query: {...sendQuery}})
    }
  },
  computed: {
    ...mapState({
      me: (state) => state.Login.me,
      users: (state) => state.Users.users.list
    }),
    onReadyToExtract() {
      return (
        this.categories_selected.length > 0 &&
        this.objects_selected.length &&
        this.users_selected.length
      )
    }
  },
  components: {datetime, multiselect, tableHistoryInfo}
}
</script>

<style lang="scss">
.history-info {
  display: flex;
  flex-direction: column;
  .history-title {
    font-size: 1.5rem;
    font-weight: 700;
  }
  .history-filter-row {
    max-width: 720px;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    .multiselect {
      min-width: 277px;
      width: 100%;
      padding-bottom: 10px;
    }

    p.row-title {
      min-width: 120px;
    }
    p.row-space {
      padding: 0 10px;
    }

    .datepicker {
      height: 40px;
      min-width: 277px;
      width: 100%;
      margin-bottom: 10px;
    }
    .filter-button {
      display: flex;
      margin-left: auto;
      button {
        margin-left: 10px;
      }
    }
  }
}

@media screen and (max-width: 610px) {
  .history-info {
    .history-filter-row {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      p.row-title {
        width: 100%;
        min-width: none;
      }
      p.row-space {
        display: none;
      }
    }
  }
  .datepicker {
    min-width: none;
    width: 100%;
  }
}

@media screen and (max-width: 875px) and (min-width: 610px) {
  .history-info {
    .history-filter-row {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      p.row-title {
        width: 100%;
        min-width: none;
      }
      p.row-space {
        display: none;
      }
    }
  }
  .datepicker {
    width: 100%;
    min-width: none;
  }
}
</style>
