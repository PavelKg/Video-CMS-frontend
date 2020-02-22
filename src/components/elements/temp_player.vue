<template>
  <div>
    <template v-if="myUrl">
      this is url = {{ myUrl }}
      <!--video id="video" width="500px" height="450px" controls>
      </video-->
    </template>
  </div>
</template>
<script>
//import videojs1 from 'video.js'
//import 'videojs-flash'


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
