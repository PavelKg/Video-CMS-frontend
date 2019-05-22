<template>
  <div id="login-form">
    <div class="logo-container">
      <img src="../assets/images/video-icon.png" class="avatar">
    </div>
    <div class="locales-container">
      <div
        class="locale"
        v-for="(locale, index) in locales"
        :key="locale.code"
        @click="switchLocale(locale.code)"
      >
        <span v-if="index !==0 ">|</span>
        <span class="locale-item" :class="{ active: locale.code===activeLocale}">{{locale.code}}</span>
      </div>
    </div>
    <div class="app-title">
      <p>{{$t("message.app_name")}}</p>
    </div>
    <form class="login" @submit.prevent="login">
      <div class="field-container">
        <div id="user_id" class="field-row">
          <span>{{ $t("message.personal_id") }}</span>
          <input
            id="personal_id"
            required
            :placeholder="placeholder('personal ID')"
            @input="handleInput('personalId',$event.target.value)"
          >
        </div>
        <div id="password" class="field-row">
          <span>{{ $t("message.password") }}</span>
          <input
            id="password"
            type="password"
            required
            :placeholder="placeholder('password')"
            :value="password"
            @input="handleInput('password', $event.target.value)"
          >
        </div>
      </div>
      <div class="errMess">
        <span>{{$t(errMessage)}}</span>
      </div>
      <div class="button-container">
        <button type="submit">{{ $t("message.btnLogin") }}</button>
      </div>
    </form>
    <PassRec/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import PassRec from './passRecovery'

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
  },
  methods: {
    login() {
      this.errMessage = ''
      const {personalId, password} = this
      this.$store
        .dispatch('LOGIN', {personalId, password})
        .then(() => {
          if (this.authStatus === 'success') {
            this.$store.dispatch('GET_MY_PROFILE').then(() => {
              this.$router.push(`/hub/${this.me_irole}`)
            })
          } else if (this.authStatus === 'error') {
            this.errMessage = 'message.authError'
          }
          this.password = ''
        })
    },
    switchLocale(code) {
      this.$store.commit("CHANGE_LANG", code)
    },
    placeholder(item) {
      return `Enter you ${item}`
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
.avatar {
  width: 128px;
  height: 128px;
}
#login-form {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  align-items: center;
  margin: 0 auto;
  padding: 20px 60px;
}
.logo-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.locales-container {
  display: flex;
  justify-content: center;
  padding-left: 100px;
}
.locale {
  span {
    color: #cfcfcf;
  }
  span.active {
    color: #4272c4;
  }
  span.locale-item {
    margin: 0 4px;
    cursor: pointer;
  }
  span.locale-item:hover {
    color: #4272c4;
  }
}
.app-title {
  padding: 10px 0;
  p {
    font-size: 20px;
    padding: 5px 10px;
    color: #4272c4;
    border: 1px solid #4272c4;
    border-radius: 4px;
    text-align: center;
  }
}

.field-row {
  display: flex;
  align-content: center;
  margin-bottom: 10px;
  height: 30px;
  align-content: space-between;
  span {
    line-height: 30px;
    padding-right: 15px;
    font-size: 20px;
    white-space: nowrap;
    text-align: right;
    width: 100%;
  }
  input {
    margin-left: auto;
  }
}
.button-container {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
button {
  background-color: #4272c4;
  border: none;
  font-size: 20px;
  padding: 10px 40px;
  color: #fff;
  cursor: pointer;
  text-transform: uppercase;
  &:hover {
    opacity: 0.8;
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
