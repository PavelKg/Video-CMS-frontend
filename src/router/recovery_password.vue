<template>
  <div class="password-form">
    <img src="../assets/images/demo-logo.png" class="avatar" />
    <div class="pass-form-group">
      <b-form-group :state="passState" :invalid-feedback="passInvalidFeedback">
        <b-form-input
          id="password"
          type="password"
          v-model="pass"
          aria-describedby="input-password"
          :placeholder="$t('users.password')"
          trim
        >
        </b-form-input>
      </b-form-group>
      <b-form-group
        :state="passConfState"
        :invalid-feedback="passConfInvalidFeedback"
      >
        <b-form-input
          id="pass_confirm"
          type="password"
          v-model="pass_conf"
          aria-describedby="input-password-confirm"
          :placeholder="$t('users.conf_password')"
          trim
        ></b-form-input
      ></b-form-group>
      <button class="button btn-blue" :disabled="!save_enabled" @click="onSave">
        {{ $t('label.save') }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'form-pass-recovery',
  data() {
    return {
      pass: '',
      pass_conf: '',
      token: ''
    }
  },
  created() {
    this.token = this.$route.query.token
  },
  methods: {
    onSave() {
      const payload = {token: this.token, password: this.pass}
      this.$store.dispatch('SAVE_RECOVERY_PASSWORD', payload).then((res) => {
        this.$router.push('Login')
      })
    }
  },
  computed: {
    passState() {
      return this.pass.length >= 8
    },
    passConfState() {
      return !(this.pass !== this.pass_conf)
    },
    passConfInvalidFeedback() {
      let res = ''
      if (this.pass !== this.pass_conf) {
        res = 'Data entered is different'
      }
      return res
    },
    passInvalidFeedback() {
      let res = ''
      if (this.pass.length >= 8) {
        res = ''
      } else if (this.pass.length < 8) {
        res = 'Enter at least 8 characters'
      }
      return res
    },
    save_enabled() {
      return this.passState && this.passConfState
    }
  }
}
</script>

<style lang="scss">
.password-form {
  margin: 20px 0 40px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .pass-form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
      margin-top: 10px;
    }
    button {
      align-self: center;
      margin-top: 10px;
    }
  }
}
</style>
