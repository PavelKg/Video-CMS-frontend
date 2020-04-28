<template>
  <div class="export-block">
    <div>
      <a href="#" @click.prevent="toggleModal" class="password-recovery">{{
        $t('message.lnkPassRec')
      }}</a>
    </div>
    <div v-if="modalVisible" class="export-modal-block">
      <button type="button" class="export-modal-close" @click="hideModal">
        <span>X</span>
      </button>
      <form @submit.prevent="onSubmit">
        <div class="export-modal-main">
          <div class="export-modal-title">{{ $t('label.forgot_pass') }}</div>
          <div class="export-text" v-html="$t('message.forgot_pass_descr')"></div>
          <div class="export-field">
            <div>{{ $t('label.mail_address') }}:</div>
            <input
              v-model.trim="exportEmail"
              type="email"
              id="export_email"
              class="form-control"
              required
              placeholder="hello@yoursite.com"
            />
          </div>
        </div>
        <div class="export-modal-btns">
          <button
            type="submit"
            class="button btn-blue"
            @click="onSubmit"
            :disabled="onSendDisabled"
          >
            <span>{{ $t('label.send') }}</span>
          </button>
        </div>
      </form>
      <template v-if="showSendResult">
        <div class="result-message-block">
          <span class="mess-title">{{ $t('message.send_complited') }}</span>
          <span>{{ $t('message.we_have_sent_email') }}</span>
          <span>{{
            `${$t('message.destination_email_address')}: ${exportEmail}`
          }}</span>
          <b-link href="#" @click.prevent="hideModal" class="mess-home-link">{{
            $t('message.back_to_login_page')
          }}</b-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exportEmail: '',
      modalVisible: '',
      showSendResult: false
    }
  },
  computed: {
    onSendDisabled() {
      return this.showSendResult
    }
  },
  methods: {
    toggleModal() {
      this.modalVisible = !this.modalVisible
    },
    outSideClick() {
      //console.log('outside click=', this.modalVisible)
    },
    hideModal() {
      this.modalVisible = false
      this.exportEmail = ''
      this.showSendResult = false
    },
    showModal() {
      this.modalVisible = true
    },
    onSubmit() {
      if (this.exportEmail) {
        this.$store
          .dispatch('PASSWORD_RECOVERY', {
            locale: this.$i18n.locale,
            email: this.exportEmail
          })
          .then(
            (res) => {
              this.showSendResult = true
            },
            (err) => {}
          )

        //this.exportEmail = ''
        //this.hideModal()
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles.scss';

.result-message-block {
  position: inherit;
  display: flex;
  flex-direction: column;
  background: $white;
  border: 1px solid $gray-lighter;
  width: 90%;
  height: 90%;
  align-self: center;
  span {
    padding: 10px;
    font-size: 0.9rem;
  }
  .mess-title {
    padding-top: 30px;
    font-size: 1.2rem;
  }
  .mess-home-link {
    align-self: center;
  }
}

.export-block {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.export-btn {
  width: 40px;
  height: 40px;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #e1e1e1;
  color: #9b9b9b;
  cursor: pointer;
  outline: none;

  &:hover,
  &:active,
  &:focus {
    background: #fafafa;
    outline: none;
  }
}
.export-modal-block {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 600px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 4px 11px 20px -5px rgba(119, 119, 119, 0.15),
    4px -11px 20px -5px rgba(119, 119, 119, 0.15),
    -4px 11px 20px -5px rgba(119, 119, 119, 0.15);
  z-index: 100;
}
.export-modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 0px;
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 50%;
  text-align: center;
  color: #9b9b9b;
  font-size: 16px;
  cursor: pointer;
  outline: none;

  &:hover,
  &:active,
  &:focus {
    background: #fafafa;
    outline: none;
  }
}
.export-modal-main {
  max-width: 450px;
  margin: 0 auto;
  text-align: center;
  padding: 15px 24px 0;

  .form-control {
    margin: auto;
    max-width: 270px;
  }
}
.export-modal-title {
  font-size: 20px;
  text-align: center;
}
.export-text {
  margin-top: 30px;
  font-size: 14px;
  line-height: 18px;
}
.export-modal-btns {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 24px;
  border-top: 1px solid #f5f5f5;
  text-align: center;

  .btn {
    margin-left: 15px;
  }
}

.export-field {
  display: flex;
  align-items: center;
  padding: 30px 24px 10px 24px;
}

@media (max-width: 768px) {
  .export-modal-block {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: auto;
    margin-top: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .export-modal-close {
    border: none;
    font-size: 24px;
  }
  .export-text {
    margin-top: 15px;
  }
  .export-modal-btns {
    border-top: none;
    margin-top: 20px;
    padding-top: 0px;
    text-align: center;

    .btn {
      width: 100%;
      max-width: 270px;
      margin-left: 0px;
    }
  }
}

@media (max-width: 576px) {
  .export-block {
    padding-left: 8px;
  }
}
</style>
