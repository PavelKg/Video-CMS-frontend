<template>
  <div class="courses-table">
    <scrollHint v-if="!scrolled && isScrollable && !courses_is_loading" />
    <b-table
      :items="courses_on_page"
      :fields="fields"
      responsive
      striped
      hover
      head-variant="dark"
      :busy="courses_is_loading"
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
      <template #cell(name)="row">
        <b-col style="width: 25rem">
          <b-form-checkbox
            :id="row.item.name"
            :name="`ch-${row.item.name}`"
            :value="row.item.name"
            v-model="courses_selected"
            :disabled="row.item.deleted_at !== ''"
            class="truncate-text"
            >{{ row.item.name }}
          </b-form-checkbox></b-col
        >
      </template>
      <template #cell(is_published)="row">
        <b-col style="text-align: center">
          <b-icon
            v-if="row.item.is_published"
            icon="check-circle-fill"
            variant="success"
            font-scale="2"
          ></b-icon>
        </b-col>
      </template>
      <template #cell(mng)="item">
        <div class="mng-column">
          <template v-if="item.item.deleted_at === ''">
            <div v-if="isActAllow('edit')" class="icon-button">
              <img
                src="@/assets/images/edit_black.png"
                @click="editCourse(item.item)"
              />
            </div>
            <div v-if="isActAllow('delete')" class="icon-button">
              <img
                src="@/assets/images/delete_black.png"
                @click="delCourse(item.item.name)"
              /></div
          ></template>
          <template v-else>
            {{ $t('courses.tbl_deleted') }}
          </template>
        </div>
      </template>
    </b-table>
    <div class="courses-mng-panel">
      <template v-if="isActAllow('delete')">
        <span>{{ $t('courses.in_page') }}:</span>
        <a href="#" id="selectAll" @click.prevent="toggleAll">{{
          $t('label.select_all')
        }}</a>
        <span>|</span>
        <a href="#" id="deselectAll" @click.prevent="toggleAll">{{
          $t('label.deselect_all')
        }}</a>
        <button
          class="button btn-orange"
          @click="delCourses"
          :disabled="courses_selected.length === 0"
        >
          {{ $t('label.delete') }}
        </button></template
      >
      <div class="courses-mng-pag">
        <b-pagination
          :value="currentPage"
          @change="setPage"
          :total-rows="courses_count"
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
  name: 'table-courses',
  mixins: [scrollHintMix, permitsMixin],
  data() {
    return {
      permitsCategory: 'courses',
      fields: [
        {
          key: 'name',
          label: this.$t('courses.tbl_header_name'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'is_published',
          label: this.$t('courses.tbl_header_is_published'),
          thStyle: {'text-align': 'center'}
        },
        {
          key: 'mng',
          label: this.$t('courses.tbl_header_mgn'),
          thStyle: {width: '120px !important', 'text-align': 'center'}
        }
      ],
      perPage: 8,
      currentPage: 1,
      courses_selected: []
    }
  },
  watch: {
    $route(newVal) {
      this.currentPage = newVal.query.page ? newVal.query.page : 1
    },
    courses_is_loading(newVal, oldVal) {
      if (!newVal) {
        this.currentPage = this.$route.query.page ? this.$route.query.page : 1
      }
    }
  },
  components: {
    scrollHint
  },
  methods: {
    toggleAll(env) {
      const action = env.target['id']
      this.courses_selected =
        action === 'selectAll'
          ? this.courses_on_page
              .filter((course) => course.deleted_at === '')
              .map((course) => course.name)
          : []
    },
    editCourse(course) {
      this.$emit('contentElementClick', `/courses/edit/${course.name}`)
    },
    delCourse(name) {
      this.$store.dispatch('COURSE_DEL', name).then(
        (res) => {
          this.$emit('reloadData')
        },
        (err) => {
          this.$emit(
            'onContentError',
            `errors.${err.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      )
    },
    delCourses() {
      const deleted_courses = this.courses_selected.map(async (course_name) => {
        try {
          await this.$store.dispatch('COURSE_DEL', course_name)
          const ind = this.courses_selected.findIndex(
            (name) => name === course_name
          )
          if (ind > -1) {
            this.courses_selected.splice(ind, 1)
          }
        } catch (error) {
          console.log('error')
          this.$emit(
            'onContentError',
            `errors.${error.message.toLowerCase().replace(/\s/gi, '_')}`
          )
        }
      })

      Promise.all(deleted_courses).then(() => {
        this.$emit('reloadData')
      })
    },
    setPage(num) {
      this.$emit('contentElementClick', `/courses/?page=${num}`)
    }
  },
  computed: {
    ...mapGetters(['courses', 'me', 'courses_is_loading', 'is_tablet_width']),
    courses_count() {
      return this.courses ? this.courses.length : 0
    },
    courses_on_page() {
      const begin = (this.currentPage - 1) * this.perPage
      const end = begin + this.perPage

      return this.courses.slice(begin, end)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles';
.courses-table {
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

.courses-mng-panel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  .courses-mng-pag {
    display: flex;
    > * {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 875px) {
  .courses-mng-panel {
    button {
      margin-top: 15px;
      margin-left: 10px;
    }
    .courses-mng-pag {
      margin-top: 15px;
      justify-content: flex-end;
    }
  }
}
</style>
