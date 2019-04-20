<template>
  <div id="app">
    <router-view class="view"/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        window: {
          width: 0,
          height: 0
        }
      }
    },
    created() {
      window.addEventListener('resize', this.handleResize)
      this.handleResize();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      handleResize() {
        let rect = {}
        rect.width  = window.innerWidth
        rect.height = window.innerHeight;
        this.$store.commit('windowsResize', rect); 
        const tabletWidth = this.$store.getters.windowsRect.tabletMaxWidth
        if (rect.width < tabletWidth) (
          this.$store.commit('MENU_HIDE') 
        )
        //this.window.width = window.innerWidth;
        //this.window.height = window.innerHeight;

      }
    }
  }
</script>

<style lang="scss">
@import "./assets/styles";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  
}
body {
      //overflow: hidden;
}
</style>
