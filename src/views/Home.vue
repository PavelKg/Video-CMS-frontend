<template>
  <div class="home">
    <img alt="Video-CMS logo" src="../assets/video-icon.png" />
    <HelloWorld msg="Welcome to Video-CMS" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>
