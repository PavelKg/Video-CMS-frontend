<template>
  <div>
    <div class="header-zone"><headerArea /></div>
    <div
      class="menu-zone"
      v-if="!isSmallScreen || isMenuVisible"
      v-closable="{
        exclude: ['menu-btn'],
        handler: 'onHideMenu'
      }"
    >
      <menuArea />
    </div>
    <div class="body">
      <div class="content-zone">
        <router-view
          v-on:contentElementClick="contentElementClick"
          class="view"
        />
      </div>
      <b-modal
        v-model="modalErrorShow"
        size="sm"
        centered
        ok-only
        @change="onModalChange"
      >
        {{ $t(`${errors_message}`) }} !!!
      </b-modal>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import headerArea from './header'
import menuArea from './menu/'

export default {
  name: 'super-page',
  data() {
    return {
      component: null,
      modalErrorShow: false
    }
  },
  components: {
    headerArea,
    menuArea
  },
  watch: {
    errors_isShow: function(newVal, oldVal) {
      this.modalErrorShow = newVal
    }
  },
  created() {
    // const {routes} = this.$router.options
    // let routeData = routes.find((r) => r.path === this.$route.path)

    this.$store.dispatch('LOAD_USER_MENU', this.me_irole).then((res) => {
      // console.log('this.userMenu=', this.userMenu)
      // //const roleModules = modulesChilds(this.userMenu)
      // const childs = routeChilds(this.userMenu, '')
      // routeData.children = childs
      // console.log('routeData=', [routeData])
      // this.$router.addRoutes([routeData])
      // // console.log('this.$router.options=', this.$router.options)
      this.$store.dispatch('LOAD_MENU_STATE')
    })

    this.$store.commit('INIT_LANG')
  },
  mounted() {
    // this.loader()
    //   .then(() => {
    //     this.component = () => this.loader()
    //   })
    //   .catch(() => {
    //     this.component = () => import('./templates/iface/user/content')
    //   })
  },
  computed: {
    ...mapGetters([
      'windowsRect',
      'me_irole',
      'userMenu',
      'errors_isShow',
      'errors_message'
    ]),
    // loader() {
    //   return () => import(`./templates/iface/${this.me_irole}/content`)
    // },
    isMenuVisible() {
      return this.$store.getters.userMenuVisible
    },
    isSmallScreen() {
      return this.windowsRect.width < this.windowsRect.tabletMaxWidth
    }
  },
  methods: {
    onHideMenu() {
      this.$store.commit('MENU_HIDE')
    },
    onModalChange(isVisible) {
      if (!isVisible) {
        this.$store.commit('HIDE_MESSAGE_ERROR')
      }
    },
    contentElementClick(key) {
      console.log('key=', key)
      this.$store.commit('ITEM_STATE', key)
      this.$store.dispatch('SAVE_MENU_STATE')
    }
  }
}
// :style="[isMenuVisible ? {'width':'150px'} : {'width':'0px'}]"
</script>

<style lang="scss">
@import '../assets/styles';

.header-zone {
  position: fixed; /* Stay in place */
  width: 100%;
  height: 50px;
  z-index: 10; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
}
.menu-zone {
  position: fixed; /* Stay in place */
  height: 100%;
  background-color: $gray-dark;
  width: 180px; /* 0 width - change this with JavaScript */
  z-index: 10; /* Stay on top */
  left: 0;
  top: 50px;
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 10px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}
.body {
  display: flex;
  margin-left: 180px;
  margin-top: 50px;
  flex-direction: column;
  max-width: 930px;
  .content-zone {
    display: flex;
    //flex-grow: 10;
    overflow: auto;
    background-color: $gray-lightest;
    padding: 20px 20px;
  }
}

@media screen and (max-width: 768px) {
  .menu-zone {
    opacity: 0.95;
  }
  .body {
    margin-left: 0px;
  }
}
</style>
