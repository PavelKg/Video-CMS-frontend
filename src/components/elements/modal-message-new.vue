<template>
  <div class="message-new-block">
    <div class="message-new-modal-block">
      <button type="button" class="message-new-modal-close" @click="$emit('close')">
        <span>X</span>
      </button>
      <div class="message-new-modal-main">
        <div class="message-new-modal-title">Create new mail</div>
        <div class="message-new-headers">
          <div class="message-new-header-item">
            <span>
              <select v-model="selected">
                <option disabled value>To</option>
                <option>admin</option>
              </select>
            </span>
          </div>
          <div class="message-new-header-item">
            <input placeholder="Subject">
          </div>
        </div>
        <div class="message-new-text">
          <textarea placeholder="Text"/>
        </div>
      </div>
      <div class="message-new-button-zone">
        <div class="button blue" @click="$emit('close')">Send</div>
        <div class="button blue" @click="$emit('close')">Cancel</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    initModalVisible: Boolean
  },
  data() {
    return {
      messageEmail: '',
      modalVisible: this.initlModalVisible,
      selected: ''
    }
  },
  computed: {
    ...mapGetters(['active_message-new'])
  },
  methods: {}
}
</script>

<style lang="scss">
@import '@/assets/styles.scss';

.message-new-block {
  position: inherit;
  padding-left: 15px;
}

.message-new-btn {
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
.message-new-modal-block {
  position: absolute;
  top: 30%;
  right: 30%;
  margin-top: 15px;
  width: 600px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 4px 11px 20px -5px rgba(119, 119, 119, 0.15),
    4px -11px 20px -5px rgba(119, 119, 119, 0.15),
    -4px 11px 20px -5px rgba(119, 119, 119, 0.15);
  z-index: 100;
}
.message-new-modal-close {
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
.message-new-modal-main {
  //max-width: 380px;
  margin: 5px auto;
  text-align: left;
  padding: 0px 24px 0;

  .form-control {
    margin: auto;
    max-width: 270px;
  }
}
.message-new-modal-title {
  font-size: 20px;
  text-align: left;
  padding-bottom: 10px;
}
.message-new-text {
  font-size: 14px;
  line-height: 18px;
  padding-top: 10px;
  textarea {
    width: 100%;
    height: 150px;
  }
}

.message-new-headers {
  padding-top: 10px;
}
.message-new-header-item {
  padding-top: 10px;
  input {
    width: 100%;
  }
  select {
    width: 100%;
  }
  span.title {
    font-weight: 700;
  }
}
.message-new-button-zone {
  display: flex;
  padding: 10px 0;

  .button {
    display: flex;
    margin-left: 20px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 150px;
    height: 30px;
    color: #ffffff;
  }
  .blue {
    background: #4472c4;
  }
}

@media (max-width: 768px) {
  .message-new-modal-block {
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
  .message-new-modal-close {
    border: none;
    font-size: 24px;
  }
  .message-new-text {
    margin-top: 15px;
  }
}

@media (max-width: 576px) {
  .message-new-block {
    padding-left: 8px;
  }
}
</style>