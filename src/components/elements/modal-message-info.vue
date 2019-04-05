<template>
  <div class="message-block">
    <div class="message-modal-block">
      <button type="button" class="message-modal-close" @click="$emit('close')">
        <span>X</span>
      </button>
      <div class="message-modal-main">
        <div class="message-modal-title">Preview mail</div>
        <div class="message-headers">
          <div class="message-header-item">
            <span class="title">From: </span>
            <span>{{active_message.user}}</span>
          </div>
          <div class="message-header-item">
            <span class="title">Subject: </span>
            <span>{{active_message.subject}}</span>
          </div>          
        </div>
        <div class="message-text">{{active_message.text}}</div>
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
      modalVisible: this.initlModalVisible
    }
  },
  computed: {
    ...mapGetters(['active_message'])
  },
  methods: {}
}
</script>

<style lang="scss">
@import '@/assets/styles.scss';

.message-block {
  position: inherit;
  padding-left: 15px;
}

.message-btn {
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
.message-modal-block {
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
.message-modal-close {
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
.message-modal-main {
  //max-width: 380px;
  margin: 5px auto;
  text-align: left;
  padding: 0px 24px 0;

  .form-control {
    margin: auto;
    max-width: 270px;
  }
}
.message-modal-title {
  font-size: 20px;
  text-align: left;
  padding-bottom: 10px;
}
.message-text {
  margin: 20px 0;
  font-size: 14px;
  line-height: 18px;
}

.message-headers {
  padding: 10px 0;
  border-top: 1px solid #bdbec1;
  border-bottom: 1px solid #bdbec1;
}
.message-header-item {
  span.title {
    font-weight: 700;
  }
}

@media (max-width: 768px) {
  .message-modal-block {
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
  .message-modal-close {
    border: none;
    font-size: 24px;
  }
  .message-text {
    margin-top: 15px;
  }
}

@media (max-width: 576px) {
  .message-block {
    padding-left: 8px;
  }
}
</style>