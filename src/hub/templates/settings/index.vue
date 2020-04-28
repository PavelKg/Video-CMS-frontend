<template>
  <div class="settings-zone">
    <b-container v-if="false" fluid class="pb-2 px-0 bg-default">
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
                <a v-if="Boolean(authLink)" :href="authLink" target="blank">{{authLink}}</a>
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
      authLink: null,
      isLoadingAuthLink: false
    }
  },
  created() {
    this.$store.dispatch('GET_TELEGRAM_OPTIONS')
  },
  methods: {
    onTelegramLogin(user) {
      console.log({user})
    },
    onGetAuthLink() {
      this.isLoadingAuthLink = true
      this.$store.dispatch('GET_TELEGRAM_AUTH_LINK').then((res) => {
        this.authLink = res
        this.isLoadingAuthLink = false
      })
    }
  },
  components: {
    TelegramLogin
  },
  computed: {
    ...mapState({
      telegramOptions: (state) => state.Settings.telegram
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