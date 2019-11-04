<template>
  <div class="screen-zone">
    <div class="screen-comment-mng">
      <span>{{ $t('label.comment_box') }}</span>
      <div class="screen-radio-group">
        <b-form-radio-group
          v-model="cbox_selected"
          :options="cbox_options"
          @change="onCboxState"
          name="cbox-plain-inline"
          :disabled="isLoadingCboxState"
        ></b-form-radio-group>
      </div>
    </div>
    <div class="screen-logo-mng">
      <span>{{ $t('label.logo_registration') }}</span>
      <img src="@/assets/images/video-icon.png" />
      <div class="screen-logo-path">
        <input
          type="file"
          id="file"
          ref="customInput"
          class="custom-file-input"
          multiple
          accept="image/*"
          @change="addCustomFiles($event)"
        />
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
import {mapState} from 'vuex'

export default {
  name: 'screen',
  data() {
    return {
      isLoadingCboxState: true,
      cbox_selected: 'display',
      cbox_options: [
        {text: this.$t('screen.display'), value: 'display'},
        {text: this.$t('screen.hidden'), value: 'hide'}
      ]
    }
  },
  created() {
    this.isLoadingCboxState = true
    this.$store.dispatch('LOAD_COMMENTBOX_STATE', this.cid).then((res) => {
      this.cbox_selected = res.visible ? 'display' : 'hide'
      this.isLoadingCboxState = false
    })
  },
  computed: mapState({
    cid: (state) => state.Login.me.profile.company_id
  }),
  methods: {
    onCboxState(newState) {
      const cid = this.cid
      this.isLoadingCboxState = true

      this.$store
        .dispatch('UPDATE_COMMENTBOX_STATE', {cid, newState})
        .then((res) => {
          this.isLoadingCboxState = false
        })
    },
    selectLogoFile(evt) {
      evt.preventDefault()
      this.$refs.customInput.click()
    },
    uploadLogoFile() {}
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';

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
    padding-top: 20px;
    > span {
      font-size: 1.4em;
      font-weight: 600;
    }
    img {
      height: 8rem;
      width: 8rem;
      margin: 20px 0;
      border: 1px solid $gray-lighter;
    }
    .screen-logo-path {
      display: flex;
      margin-bottom: 20px;
      .custom-file-input {
        display: none;
      }
    }
  }
}
</style>
