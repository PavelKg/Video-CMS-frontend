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
      <img :src="img_path" :class="{'logo-loading': isLogoLoading}" />
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
      isLogoLoading: true,
      file: '',
      logo_img: '',
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
    this.isLogoLoading = true
    this.$store.dispatch('LOAD_LOGO', this.cid).then(
      (res) => {
        this.logo_img = this.company_logo
        this.isLogoLoading = false
      },
      (error) => {}
    )
  },
  computed: {
    ...mapState({
      cid: (state) => state.Login.me.profile.company_id,
      company_logo: (state) => state.Companies.company_logo
    }),
    img_path() {
      return this.logo_img !== ''
        ? this.logo_img
        : require('@/assets/images/p-streamCMS-s.png')
    }
  },
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
    uploadLogoFile() {
      this.$store
        .dispatch('SAVE_LOGO', {cid: this.cid, logo_data: this.logo_img})
        .then((res) => {}, (error) => {})
    },
    addCustomFiles(evt) {
      evt.preventDefault()

      this.file = event.target.files[0]
      if (this.file) {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          let reader = new FileReader()

          reader.addEventListener(
            'load',
            function() {
              this.logo_img = reader.result
            }.bind(this),
            false
          )
          reader.readAsDataURL(this.file)
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';
.logo-loading {
  opacity: 0.2;
}
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
      height: 10rem;
      width: 10rem;
      margin: 20px 0;
      padding: 1rem;
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
