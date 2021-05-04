<template>
  <div class="card-area">
    <b-card-group deck>
      <b-card
        :title="course.name"
        img-src="https://picsum.photos/300/150/?image=41"
        img-alt="Image"
        img-top
      >
        <b-card-text>
          {{ course.details }}
        </b-card-text>
        <b-button
          v-if="course.apply"
          href="#"
          variant="primary"
          @click="onCourseApply"
          >{{ $t('courses.btn_apply') }}</b-button
        >
        <template #footer>
          <small class="text-muted"
            >Duration: {{ Math.floor(Math.random() * 9) + 1 }} weeks</small
          >
        </template>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  props: ['course'],
  methods: {
    onCourseApply() {
      this.$emit('onCourseApply', this.course.name)
    }
  }
}
</script>
<style lang="scss">
.card-area {
  padding-top: 15px;
}
</style>
