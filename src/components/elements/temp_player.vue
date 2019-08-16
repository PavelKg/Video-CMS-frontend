<template>
  <div>
    <template v-if="myUrl">
      this is url = {{ myUrl }}
      <video id="video" width="500px" height="450px" controls>
        <source
          src="https://download.blender.org/peach/trailer/trailer_1080p.ogg"
          type="video/ogg"
        />
      </video>
    </template>
  </div>
</template>
<script>
export default {
  props: ['videourl', 'src', 'type'],

  data() {
    return {}
  },
  computed: {
    myUrl() {
      return this.videourl
    }
  }
}
</script>
