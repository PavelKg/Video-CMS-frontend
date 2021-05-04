<template>
  <div>
    <b-container class="bv-cards" fluid>
      <b-row>
        <b-col v-for="(course, index) in courses_list" :key="index" sm="2">
          <Card :course="course" @onCourseApply="onCourseApply"></Card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Card from './card'
export default {
  props: {courses_list: {type: Array}},
  data() {
    return {}
  },
  methods: {
    onCourseApply(name) {
      this.$emit('onCourseApply', name)
    }
  },
  components: {
    Card
  }
}
</script>
