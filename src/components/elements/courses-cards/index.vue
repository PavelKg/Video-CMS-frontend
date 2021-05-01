<template>
  <div>
    <b-container class="bv-cards" fluid>
      <b-row>
        <b-col v-for="(course, index) in courses_list" :key="index" sm="2">
          <Card :course="course"></Card>
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
  components: {
    Card
  }
}
</script>
