<template>
  <div class="screen-zone">
    <div class="screen-comment-mng">
      <span>{{ $t('label.comment_box') }}</span>
      <div class="screen-radio-group">
        <b-form-radio-group
          v-model="cbox_selected"
          :options="cbox_options"
          name="cbox-plain-inline"
        ></b-form-radio-group>
      </div>
    </div>
    <div class="screen-logo-mng">
      <span>{{ $t('label.logo_registration') }}</span>
      <img src="@/assets/images/video-icon.png" />
      <div class="screen-logo-path">
        <input id="logoFilePath" placeholder="" />
        <button class="button btn-grey" @click="selectLogoFile">
          {{ $t('label.select_file') }}
        </button>
      </div>
      <div>
      <button class="button btn-blue" @click="uploadLogoFile">
        {{ $t('label.upload') }}
      </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'screen',
  data() {
    return {
      cbox_selected: 'display',
      cbox_options: [
        {text: 'Display', value: 'display'},
        {text: 'Hidden', value: 'hidden'}
      ]
    }
  },
  methods: {
    selectLogoFile() {},
    uploadLogoFile() {}
  }
}
</script>

<style lang="scss">
.screen-zone {
  .screen-comment-mng {
    > span {
      font-size: 1.4em;
      font-weight: 600;
    }
    .screen-radio-group {
      margin: 10px auto;
    }
  }
  .screen-logo-mng {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    > span {
      font-size: 1.4em;
      font-weight: 600;
    }
    img {
      height: 6rem;
      width: 6rem;
      margin: 20px 0;
    }
    .screen-logo-path{
      display:flex;
      margin: 20px 0;
      input{
        margin-right: 10px;
      }
    }
  }
}
</style>
