<template>
  <div class="tests-mng">
    <div class="button-zone">
      <button
        v-if="isActAllow('add')"
        class="button btn-blue"
        @click="addNewTest"
      >
        {{ $t('tests.btn_add') }}
      </button>
      <b-checkbox
        class="ml-auto pt-2"
        v-model="isShowDeleted"
        @input="loadTestsList"
      >
        {{ $t('label.show_deleted') }}
      </b-checkbox>
    </div>
    <div class="tests-mng-table">
      <TableTests
        @contentElementClick="contentElementClick"
        @onContentError="onError"
        @reloadData="loadTestsList"
        :tests="testList"
        :tests_is_loading="isLoading"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import TableTests from '@/components/elements/table-tests'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'tests-mng',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'tests',
      isShowDeleted: false,
      testList: [],
      isLoading: false
    }
  },
  components: {
    TableTests
  },
  created() {
    this.loadTestsList()
  },
  computed: {
    ...mapState({})
  },
  methods: {
    async loadTestsList() {
      this.isLoading = true
      const filter = !this.isShowDeleted ? 'tests.deleted_at[isNull]:' : ''
      try {
        this.testList = await this.$store.dispatch('LOAD_TESTS', {filter})
      } catch (err) {
      } finally {
        this.isLoading = false
      }

      //.then(() => this.$store.commit('SET_S_IS_LOADING', false))
    },
    addNewTest() {
      this.contentElementClick('/tests/add')
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    onError(message) {
      this.$store.commit('SHOW_MESSAGE_ERROR', message)
    }
  }
}
</script>

<style lang="scss">
.button-zone {
  display: flex;
}
// .roles-mng {
//   .roles-mng-buttons {
//     padding: 10px 0;
//     .create-new {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       cursor: pointer;
//       width: 150px;
//       height: 40px;
//       color: #ffffff;
//     }
//     .blue {
//       background: #4472c4;
//     }
//   }
//}
</style>
