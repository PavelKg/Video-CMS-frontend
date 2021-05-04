<template>
  <div>
    <div class="courses-catalog">
      <b-container class="bv-row">
        <b-row class="justify-content-md-center " align-v="center">
          <b-col sm class="text-center category-submenu">
            <b-link
              href="#"
              @click="onChangeCategory('catalog')"
              class="category-link"
              :class="{active: active_category === 'catalog'}"
              >{{ $t('courses-catalog.home') | capitalize }}</b-link
            ></b-col
          >
          <b-col sm class="text-center category-submenu">
            <b-link
              href="#"
              @click="onChangeCategory('in-progress')"
              class="category-link"
              :class="{active: active_category === 'in-progress'}"
              >{{ $t('courses-catalog.in_progress') | capitalize }}</b-link
            ></b-col
          >
          <b-col sm class="text-center category-submenu">
            <b-link
              href="#"
              @click="onChangeCategory('completed')"
              class="category-link"
              :class="{active: active_category === 'completed'}"
              >{{ $t('courses-catalog.completed') | capitalize }}</b-link
            ></b-col
          >
        </b-row>
      </b-container>
    </div>
    <div class="course-cards-wrapper">
      <CoursesCards
        :courses_list="courses_list"
        @onCourseApply="onCourseApply"
      ></CoursesCards>
    </div>
  </div>
</template>

<script>
import CoursesCards from '@/components/elements/courses-cards'
export default {
  data() {
    return {
      active_category: '',
      courses_list: []
    }
  },
  components: {
    CoursesCards
  },
  created() {
    const pm = this.$route.params.pathMatch
    this.onChangeCategory(pm)
  },

  filters: {
    capitalize: function(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  methods: {
    async onCourseApply(name) {
      try {
        const res = await this.$store.dispatch('COURSE_APPLY', name)
        this.onChangeCategory('in-progress')
      } catch (err) {
        console.log(err)
      }
    },
    onChangeCategory(category) {
      if (this.active_category === category) {
        return
      }
      this.active_category = category
      this.$store.dispatch('LOAD_COURSES_CATALOG', category).then((res) => {
        const list = res.map((course) => {
          const curr = {...course}
          if (category === 'catalog') {
            curr.apply = true
          }
          return curr
        })
        this.courses_list = [...list]
      })

      this.$router.push(`/courses-${category}`, () => {})
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/styles.scss';
.courses-catalog {
  background: white;
  margin-left: -20px;
  margin-right: -20px;
  margin-top: -20px;
  .bv-row {
    margin-left: unset;
  }
}
.category-submenu {
  height: 50px;
}
.category-link {
  text-decoration: none;
  &:hover {
    text-decoration: none;
    color: $blue-active;
    border-bottom: 4px solid $blue-active;
  }
  color: $link-active;
  padding: 0 20px 15px;
  line-height: 3rem;
  font-weight: 600;
}
.active {
  border-bottom: 4px solid $blue-active;
}
.course-cards-wrapper {
  padding-top: 10px;
}
</style>
