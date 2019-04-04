<template>
  <div class="video-box-item">
    <div class="video-box-item-content" @click="playVideo">
      <img :src="img_puth">  
    </div>
    <div class="mng-panel">
      <b-form-checkbox :id="`check-1`" :name="'check1'"></b-form-checkbox>
      <span>{{description}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'video-face-box',
  props: {
    videoitem: Object
  },
  methods: {
    playVideo() {
      this.$store.commit('SET_ACTIVE_VIDEO', this.videoitem)
      this.$store.commit('GET_COMMENTS')
      this.$emit('activateContent', 'root.subItems.videos.subItems.video_player')
    }
  },
  computed: {
    description() {
      return this.videoitem['description']
    },
    img_puth() {
      const num = Math.round(Math.random()*6)+1
      var images = require.context('@/assets/images/fake-face', false, /\.png$/)
      return images('./' + num + ".png")
    }

  }
}
</script>

<style lang="scss" scoped>
  .video-box-item {
    width: 200px;
    height: 150px;
    .video-box-item-content {
      display: flex;
      // height: 100px;
      // width: 180px;
      //background: #dcdcdc;
      img {
        height: 100px;
        width: 180px;
        cursor: pointer;
      }
    }
    .mng-panel {
      display: flex;
      span {
        align-self: flex-start;
      }
    }
  }
</style>
