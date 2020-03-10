<template>
  <div>
    <div class="header-zone"><headerArea /></div>
    <div
      id="menu-zone-box"
      class="menu-zone"
      v-if="!isSmallScreen || isMenuVisible"
      v-closable="{
        exclude: ['menu-btn'],
        handler: 'onHideMenu'
      }"
    >
      <menuArea />
    </div>
    <div class="contents">
      <div class="content-zone">
        <router-view
          v-on:contentElementClick="contentElementClick"
          class="view"
        />
      </div>
      <b-modal
        :visible="modalErrorShow"
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
import {mapGetters, mapState} from 'vuex'
import headerArea from './header'
import menuArea from './menu/'

export default {
  name: 'super-page',
  data() {
    return {
      component: null
    }
  },
  components: {
    headerArea,
    menuArea
  },
  created() {
    const cid = this.cid
    this.$store.dispatch('LOAD_USER_MENU', this.me_irole).then((res) => {
      this.$store.dispatch('LOAD_MENU_STATE')
    })

    this.$store.dispatch('LOAD_VIDEO_INFO_LOCATION', cid)

    this.$store.commit('INIT_LANG')
  },

  computed: {
    ...mapGetters([
      'windowsRect',
      'me_irole',
      'userMenu',
      'errors_isShow',
      'errors_message'
    ]),
    ...mapState({
      cid: (state) => state.Login.me.profile.company_id
    }),

    isMenuVisible() {
      return this.$store.getters.userMenuVisible
    },
    isSmallScreen() {
      return this.windowsRect.width < this.windowsRect.tabletMaxWidth
    },
    modalErrorShow() {
      return this.errors_isShow
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
      this.$store.dispatch('MENU_NAVIGATE', key)
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
.contents {
  margin-top: 50px;
  float: right;
  width: calc(100% - 180px);

  .content-zone {
    padding: 20px;
  }
}

@media screen and (max-width: 910px) {
  .menu-zone {
    opacity: 0.95;
  }
  .contents {
    width: 100%;
  }
}
</style>
