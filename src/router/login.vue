<template>
  <div id="login-form">
    <div class="logo-container">
      <img src="../assets/images/demo-logo.png" class="avatar" />
    </div>
    <div class="locales-container">
      <div
        class="locale"
        v-for="(locale, index) in locales"
        :key="locale.code"
        @click="switchLocale(locale.code)"
      >
        <span v-if="index !== 0">|</span>
        <span
          class="locale-item"
          :class="{active: locale.code === activeLocale}"
          >{{ locale.code }}</span
        >
      </div>
    </div>
    <div class="login-app-title">
      <span class="app-title-name">{{ $t('message.app_name') }}</span>
    </div>
    <form class="login" @submit.prevent="login">
      <div class="field-container">
        <div id="user_id" class="field-row">
          <span>{{ $t('message.personal_id') }}:</span>
          <input
            id="personal_id"
            required
            :placeholder="`${$t('message.enter_you_personal_id')}`"
            @input="handleInput('personalId', $event.target.value)"
          />
        </div>
        <div id="password" class="field-row">
          <span>{{ $t('message.password') }}:</span>
          <input
            id="password"
            type="password"
            required
            :placeholder="`${$t('message.enter_you_password')}`"
            :value="password"
            @input="handleInput('password', $event.target.value)"
          />
        </div>
      </div>
      <div class="errMess">
        <span>{{ $t(errMessage) }}</span>
      </div>
      <div class="button-container">
        <button type="submit" class="button btn-blue">
          {{ $t('message.btnLogin') }}
        </button>
      </div>
    </form>
    <PassRec />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import PassRec from './sendReqPassRecovery'

export default {
  name: 'app',
  data() {
    return {
      personalId: 'personal Id',
      password: '',
      errMessage: ''
    }
  },
  components: {
    PassRec
  },
  mounted() {
    this.$store.commit('INIT_LANG')
    //this.$store.commit('CHANGE_LANG', br_lang === 'ja' ? 'jp': br_lang)
  },
  methods: {
    login() {
      this.errMessage = ''
      const {personalId, password} = this
      this.$store.dispatch('LOGIN', {personalId, password}).then(() => {
        if (this.authStatus === 'success') {
          this.$store.dispatch('GET_MY_PROFILE').then(() => {
            this.$router.push(`/hub/videos`)
          })
        } else if (this.authStatus === 'error') {
          this.errMessage = 'message.authError'
        }
        this.password = ''
      })
    },
    switchLocale(code) {
      this.$store.commit('CHANGE_LANG', code)
    },
    handleInput(elem, value) {
      this[elem] = value
    }
  },
  computed: {
    ...mapGetters(['locales', 'authStatus', 'me', 'me_irole']),
    activeLocale() {
      return this.$i18n.locale
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles';

.avatar {
  //width: 330px;
  //height: 137px;
}
#login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 20px 0px;
  width: 330px;
}
.logo-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.locales-container {
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
  margin-top: 10px;
  //padding-left: 250px;
}
.locale {
  span {
    color: #cfcfcf;
  }
  span.active {
    color: $blue;
  }
  span.locale-item {
    margin: 0 4px;
    cursor: pointer;
  }
  span.locale-item:hover {
    color: $blue;
  }
}
.login-app-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 102px;
  margin: 10px 0 20px 0;
  border: 1px solid $blue;
  //border-bottom: 1px solid $blue;
  border-radius: 14px;
  text-align: center;
  .app-title-name {
    font-size: 24px;
    padding: 15px;
    color: $blue;
  }
}
.field-container {
  display: flex;
  flex-direction: column;
  .field-row {
    display: flex;
    margin-bottom: 10px;
    height: 30px;
    span {
      display: flex;
      justify-content: flex-end;
      padding: 0 7px;
      font-size: 20px;
      width: 100px;
    }
    input {
      padding-left: 5px;
    }
  }
}

.button-container {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  .button {
    min-width: 100px;
  }
}
.password-recovery {
  display: flex;
  justify-content: center;
  white-space: nowrap;
}

.errMess {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  height: 10px;
  span {
    color: red;
    text-align: right;
  }
}
@media (max-width: 768px) {
}
@media (max-width: 400px) {
}
</style>
