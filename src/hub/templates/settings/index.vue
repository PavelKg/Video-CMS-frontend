<template>
  <div class="settings-zone">
    <b-container v-if="+cid===2" fluid class="pb-2 px-0 bg-default">
      <b-row>
        <b-col>
          <span class="row-label">{{ $t('label.user_settings') }}</span>
        </b-col>
      </b-row>
      <template v-if="telegramOptions.botname">
        <b-row class="my-2">
          <b-col>
            <span>Telegram auth #1</span>
            <TelegramLogin
              mode="callback"
              :telegram-login="telegramOptions.botname"
              @callback="onTelegramLogin"
            />
          </b-col>
        </b-row>
        <span>
          Status:
          <span :style="{'color':isAuthLoginWidgetSuccess?'green':'red'}">{{authLoginWidget}}</span>
        </span>
      </template>
      <template v-if="telegramOptions.botname">
        <b-row class="mt-2">
          <b-col>
            <span>Telegram auth #2</span>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <button class="button btn-blue" @click="onGetAuthLink">Get Direct Auth Link</button>
            <div class="mt-2">
              <span>
                Auth Link:
                <template v-if="isLoadingAuthLink">
                  <span>Loading...</span>
                </template>
                <template v-if="authLinkStatus==='err'">
                  <span>{{authLink}}</span>
                </template>
                <a
                  v-if="Boolean(authLink) && authLinkStatus!=='err'"
                  :href="authLink"
                  target="blank"
                >{{authLink}}</a>
              </span>
            </div>
          </b-col>
        </b-row>
      </template>
    </b-container>
  </div>
</template>
<script>
import {TelegramLogin} from '@/components/elements/telegram-login/index.js'
import {mapState} from 'vuex'

export default {
  name: 'settings',
  data() {
    return {
      authLoginWidget: '',
      isAuthLoginWidgetSuccess: false,
      authLink: null,
      authLinkStatus: null,
      isLoadingAuthLink: false
    }
  },
  created() {
    this.$store.dispatch('GET_TELEGRAM_OPTIONS')
  },
  methods: {
    onTelegramLogin(user) {
      this.isAuthLoginWidgetSuccess = true
      this.$store.dispatch('TELEGRAM_AUTH_LOGIN', user).then(
        () => {
          this.authLoginWidget = 'Success'
        },
        (err) => {
          this.isAuthLoginWidgetSuccess = false
          this.authLoginWidget = err
        }
      )
    },
    onGetAuthLink() {
      this.isLoadingAuthLink = true
      this.authLinkStatus = null
      this.authLink = ''
      this.$store.dispatch('GET_TELEGRAM_AUTH_LINK').then(
        (res) => {
          this.authLink = res
          this.isLoadingAuthLink = false
        },
        (err) => {
          this.authLinkStatus = 'err'
          this.authLink = err
          this.isLoadingAuthLink = false
        }
      )
    }
  },
  components: {
    TelegramLogin
  },
  computed: {
    ...mapState({
      telegramOptions: (state) => state.Settings.telegram,
      cid: (store) => store.Login.me.profile.company_id
    })
  }
}
</script>
<style lang="scss">
.row-label {
  font-size: 1.4em;
  font-weight: 550;
}
</style>