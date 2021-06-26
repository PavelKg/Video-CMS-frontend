<template>
  <div class="tests-table">
    <scrollHint v-if="!scrolled && isScrollable && !tests_is_loading" />

    <b-table
      :id="'tests-table'"
      :items="tests_on_page"
      :fields="fields"
      responsive
      striped
      hover
      head-variant="dark"
      :busy="tests_is_loading"
      v-scroll-hint="{
        scrollHandler: 'onTableScrolled',
        isScrollable: 'isScrollable'
      }"
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="pl-2">Loading...</strong>
        </div>
      </template>
      <template #cell(uuid)="item">
        <b-col style="width: 25rem">
          <b-form-checkbox
            :id="item.item.uuid.toString()"
            :name="`ch-${item.item.uuid}`"
            :value="item.item.uuid"
            v-model="tests_selected"
            :disabled="itemIsDeleted(item.item)"
            class="truncate-text"
          >
            {{ item.item.title }}
          </b-form-checkbox></b-col
        >
      </template>
      <template #cell(description)="item">
        <b-col style="width: 25rem">
          <p class="truncate-text">
            {{ item.item.description }}
          </p>
        </b-col>
      </template>
      <template #cell(is_public)="item">
        <b-col style="text-align: center">
          <b-icon
            v-if="item.item.is_public"
            icon="check-circle-fill"
            variant="success"
            font-scale="1.7"
          ></b-icon>
        </b-col>
      </template>
      <template #cell(mng)="item">
        <div class="mng-column">
          <template v-if="!itemIsDeleted(item.item)">
            <div v-if="isActAllow('edit')" class="icon-button">
              <img
                src="@/assets/images/edit_black.png"
                @click="editTest(item.item.uuid)"
              />
            </div>
            <div v-if="isActAllow('delete')" class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delTest(item.item.uuid)"
              /></div
          ></template>
          <template v-else>
            {{ $t('roles.tbl_deleted') }}
          </template>
        </div>
      </template>
    </b-table>
    <div class="tests-mng-panel">
      <template v-if="isActAllow('delete')">
        <span>{{ $t('roles.in_page') }}:</span>
        <a href="#" id="selectAll" @click.prevent="toggleAll">{{
          $t('label.select_all')
        }}</a>
        <span>|</span>
        <a href="#" id="deselectAll" @click.prevent="toggleAll">{{
          $t('label.deselect_all')
        }}</a>
        <button
          class="button btn-orange"
          @click="delTests"
          :disabled="tests_selected.length === 0"
        >
          {{ $t('label.delete') }}
        </button></template
      >
      <div class="roles-mng-pag">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="tests_count"
          :per-page="perPage"
          align="left"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import scrollHint from './scroll-hint'
import scrollHintMix from '@/mixins/scroll-hint'
import permitsMixin from '@/mixins/permits'

export default {
  props: {tests: Array, tests_is_loading: Boolean},
  name: 'table-tests',
  mixins: [scrollHintMix, permitsMixin],
  data() {
    return {
      permitsCategory: 'tests',
      perPage: 8,
      currentPage: 1,
      tests_selected: []
    }
  },
  watch: {
    $route(newVal) {
      const page = +newVal.query.page
      this.currentPage = page ? page : 1
    },
    tests_is_loading(newVal, oldVal) {
      const {page} = this.$route.query
      if (!newVal) {
        this.currentPage = page ? page : 1
      }
    }
  },
  components: {
    scrollHint
  },
  methods: {
    itemIsDeleted(item) {
      return !['', null].includes(item.deleted_at)
    },
    editTest(uuid) {
      this.$emit('contentElementClick', `/tests/edit/${uuid}`)
    },
    delTest(uuid) {
      this.$store.dispatch('TEST_DEL', uuid).then(
        (res) => {
          this.$emit('reloadData')
        },
        (err) => {
          console.log('err.message=', err)
          this.$emit(
            'onContentError',
            `errors.${err.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      )
    },
    delTests() {
      const deleted_tests = this.tests_selected.map(async (uuid) => {
        try {
          await this.$store.dispatch('TEST_DEL', uuid)
          const ind = this.tests_selected.findIndex(
            (sel_uuid) => sel_uuid === uuid
          )
          if (ind > -1) {
            this.tests_selected.splice(ind, 1)
          }
        } catch (error) {
          this.$emit(
            'onContentError',
            `errors.${error.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      })

      Promise.all(deleted_tests).then(() => {
        this.$emit('reloadData')
      })
    },
    setPage(num) {
      if (num === this.currentPage) {
        return
      } else {
        this.$emit('contentElementClick', `/tests/?page=${num}`)
      }
    },
    toggleAll(env) {
      const action = env.target['id']
      this.tests_selected =
        action === 'selectAll'
          ? this.tests_on_page
              .filter((test) => test.deleted_at === '')
              .map((test) => test.uuid)
          : []
    }
  },
  computed: {
    ...mapGetters(['is_tablet_width']),
    tests_count() {
      return this.tests ? this.tests.length : 0
    },
    tests_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.tests.slice(begin, end)
    },
    fields() {
      return [
        {
          key: 'uuid',
          label: this.$t('tests.tbl_header_title'),
          thStyle: {'text-align': 'center', 'vertical-align': 'middle'}
        },

        {
          key: 'description',
          label: this.$t('tests.tbl_header_description'),
          thStyle: {'text-align': 'center', 'vertical-align': 'middle'}
        },

        {
          key: 'is_public',
          label: !this.showColumn
            ? this.$t('tests.tbl_header_public')
            : 'Public',
          thStyle: {
            'text-align': 'center',
            'max-width': '10rem',
            'vertical-align': 'middle'
          },
          tdStyle: {
            'text-align': 'center',
            'max-width': '10rem',
            'vertical-align': 'middle'
          }
        },
        {
          key: 'mng',
          label: this.$t('roles.tbl_header_mng'),
          thStyle: {
            width: '120px !important',
            'text-align': 'center',
            'vertical-align': 'middle'
          }
        }
      ]
    },
    showColumn() {
      //return this.is_mobile_width ? 'd-none' : ''
      return ''
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';

.tests-table {
  position: relative;
  padding: 10px 0;
}

.deleted_item {
  color: $link;
}

.mng-column {
  display: flex;
  justify-content: space-around;
}

.truncate-text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.tests-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .tests-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 875px) {
  .tests-mng-panel {
    button {
      margin-top: 15px;
    }
    .tests-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
