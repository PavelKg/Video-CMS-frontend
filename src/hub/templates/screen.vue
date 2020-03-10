<template>
  <div class="screen-zone">
    <b-container fluid class="pb-2 px-0 bg-default">
      <b-row>
        <b-col>
          <span class="row-label">{{ $t('label.comment_box') }}</span>
        </b-col>
      </b-row>
      <b-row class="py-2">
        <b-col>
          <b-form-radio-group
            v-model="cbox_selected"
            :options="cbox_options"
            @change="onCboxState"
            name="cbox-plain-inline"
            :disabled="isLoadingCboxState"
          >
          </b-form-radio-group>
        </b-col>
      </b-row>
      <b-row class="py-3">
        <b-col>
          <span class="row-label">{{
            $t('label.video_information_location')
          }}</span>
        </b-col>
      </b-row>
      <b-row class="py-2">
        <b-col>
          <b-form-radio-group
            :checked="video_info_location"
            :options="vid_info_location_options"
            @change="onVideoInfoLocateState"
            :disabled="isLoadingVideoInfoLocation"
          >
          </b-form-radio-group>
        </b-col>
      </b-row>
      <b-row class="py-3">
        <b-col>
          <span class="row-label">{{ $t('label.logo_registration') }}</span>
        </b-col>
      </b-row>
      <b-row class="py-2">
        <b-col>
          <img
            :src="img_path"
            :class="{'logo-loading': isLogoLoading}"
            class="img-logo"
          />
        </b-col>
      </b-row>
      <b-row class="py-2">
        <b-col>
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
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <button class="button btn-blue" @click="uploadLogoFile">
            {{ $t('label.upload') }}
          </button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'screen',
  data() {
    return {
      isLogoLoading: true,
      isLoadingVideoInfoLocation: false,
      file: '',
      logo_img: '',
      isLoadingCboxState: true,
      cbox_selected: 'display',
      cbox_options: [
        {text: this.$t('screen.display'), value: 'display'},
        {text: this.$t('screen.hidden'), value: 'hide'}
      ],
      vid_info_location_options: [
        {text: this.$t('screen.below_the_player'), value: 'bottom'},
        {text: this.$t('screen.next_to_the_player'), value: 'next'}
      ]
    }
  },
  created() {
    this.isLoadingCboxState = true
    this.videoInfoLocation = this.video_info_location
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
      company_logo: (state) => state.Companies.company_logo,
      video_info_location: (state) => state.Companies.video_info_location
    }),
    img_path() {
      return this.logo_img !== ''
        ? this.logo_img
        : require('@/assets/images/p-streamCMS-s.png')
    }
  },
  methods: {
    onVideoInfoLocateState(location) {
      const cid = this.cid
      this.isLoadingVideoInfoLocation = true
      this.$store
        .dispatch('UPDATE_VIDEO_INFO_LOCATION', {cid, location})
        .then((res) => {
          this.isLoadingVideoInfoLocation = false
        })
    },

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
        .then(
          (res) => {},
          (error) => {}
        )
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
.custom-file-input {
  display: none;
}
.row-label {
  font-size: 1.4em;
  font-weight: 550;
}

.img-logo {
  height: 10rem;
  width: 10rem;
  padding: 1rem;
  border: 1px solid $gray-lighter;
}

.logo-loading {
  opacity: 0.2;
}
.screen-zone {
  .screen-radio-group {
    margin: 10px auto;
  }

  .screen-logo-mng {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    > span {
      font-size: 1.4em;
      font-weight: 600;
    }

    .screen-logo-path {
      display: flex;
      margin-bottom: 20px;
    }
  }
}
</style>
