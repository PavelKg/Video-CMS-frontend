<template>
  <div class="courses-mng">
    <div class="button-zone">
      <button
        v-if="isActAllow('add')"
        class="button btn-blue"
        @click="addNewCourse"
      >
        {{ $t('courses.btn_add') }}
      </button>
      <b-checkbox
        class="ml-auto pt-2"
        v-model="isShowDeleted"
        @input="loadCoursesList"
      >
        {{ $t('label.show_deleted') }}
      </b-checkbox>
    </div>
    <coursesTable
      @contentElementClick="contentElementClick"
      @onContentError="onError"
      @reloadData="loadCoursesList"
    />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import coursesTable from '@/components/elements/table-courses'
import permitsMixin from '@/mixins/permits'

export default {
  name: 'courses',
  mixins: [permitsMixin],
  data() {
    return {
      permitsCategory: 'courses',
      isShowDeleted: false
    }
  },
  created() {
    this.loadCoursesList()
  },
  methods: {
    loadCoursesList() {
      const cid = this.cid
      const filter = !this.isShowDeleted ? 'courses.deleted_at[isNull]:' : ''
      this.$store
        .dispatch('LOAD_COURSES', {cid, filter})
        .then(() => this.$store.commit('SET_COURSES_IS_LOADING', false))
    },
    addNewCourse() {
      this.contentElementClick('/courses/add')
    },
    contentElementClick(key) {
      this.$emit('contentElementClick', key)
    },
    onError(message) {
      this.$store.commit('SHOW_MESSAGE_ERROR', message)
    }
  },
  components: {
    coursesTable
  },
  computed: {
    ...mapState({
      cid: (store) => store.Login.me.profile.company_id
    })
  }
}
</script>

<style lang="scss">
.button-zone {
  display: flex;
}
</style>
