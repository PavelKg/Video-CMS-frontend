<template>
  <div class="header">
    <div class="app-menu">
      <img @click="toggle_menu" id="menu-btn" src="../assets/images/menu_white.png" />
    </div>
    <div class="app-title">{{ $t('message.appHeader') }}</div>
    <div class="user-info">
      <img
        @click="open_user_info"
        id="user-info-btn"
        src="../assets/images/acc-circle-white-24dp.png"
        class="user-logo"
      />
      <span v-if="!isSmallScreen">{{ me_login }}</span>
    </div>
    <div
      id="user_info_block_logo"
      v-if="user_info_block_open"
      class="user_info_block"
      v-closable="{
        exclude: ['user-info-btn'],
        handler: 'handleClickOutside'
      }"
    >
      <span class="btn-settings" @click="user_settings">{{ $t('label.user_settings') }}</span>
      <span class="btn-settings" @click="user_logout">{{ $t('message.logOut') }}</span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {},
  name: 'headerArea',
  mounted() {},
  data() {
    return {
      user_info_block_open: false
    }
  },
  methods: {
    open_user_info() {
      this.user_info_block_open = !this.user_info_block_open
    },
    toggle_menu() {
      const appWidth = this.windowsRect.width < this.windowsRect.tabletMaxWidth
      if (appWidth) {
        this.$store.commit('MENU_TOGGLE')
      }
    },
    user_logout() {
      this.$store.dispatch('LOGOUT').then(() => {
        this.$router.push(`/login`)
      })
    },
    user_settings() {
      this.user_info_block_open = false
      this.$emit('contentElementClick', '/settings')
    },
    handleClickOutside() {
      this.user_info_block_open = false
    }
  },
  computed: {
    ...mapGetters(['me', 'me_irole', 'windowsRect']),
    me_login() {
      return this.me.profile.uid
    },
    isSmallScreen() {
      return this.windowsRect.width < this.windowsRect.tabletMaxWidth
    }
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #464a4f;
  height: 50px;
  top: 0px;
  left: 0px;
}
.app-menu {
  cursor: pointer;
  padding: 2px 5px;
  width: auto;
}
.app-title {
  display: flex;
  flex-grow: 20;
  align-items: center;
  font-size: 1.4rem;
  color: white;
  //padding-left: 1px;
  justify-content: center;
  transition: 0.5s;
}
.user-info {
  display: flex;
  flex-grow: 2;
  justify-content: flex-end;
  flex-direction: row;
  padding-right: 20px;

  span {
    padding-left: 10px;
    font-size: 20px;
    color: white;
    align-self: center;
  }
  .user-logo {
    cursor: pointer;
    padding: 2px 0;
    width: auto;
  }
}
.user_info_block {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 52px;
  right: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 120px;
  //height: 30px;
  align-self: center;
  justify-content: center;
  background: #fafafa;
  .btn-settings {
    text-align: center;
    width: 100%;
    align-self: center;
    cursor: pointer;
    text-decoration: none;
    padding: 0.3rem 0;
    color: #464a4f;
    &:hover {
      background: #fff;
    }
  }
}

@media screen and (max-width: 550px) {
  .app-title {
    font-size: 1rem;
  }
}
</style>
