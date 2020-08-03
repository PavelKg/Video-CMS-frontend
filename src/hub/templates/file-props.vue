<template>
  <div class="file-props">
    <template v-if="fileNotFound">
      <div class="file-not-found">
        <span>Sorry. File is not found!!!</span>
        <br />
        <button
          @click="backToCatalog"
          class="button btn-braun"
        >{{ dataUpdated ? $t('label.back') : $t('label.cancel') }}</button>
      </div>
    </template>
    <template v-else>
      <span>{{ $t('label.edit_file') }}</span>
      <!--span>{{ $t('label.thumb_image_upload') }}</span-->
      <form ref="subtitlesForm" @submit.prevent.stop="onSubmit">
        <!--b-container fluid class="pb-2 px-0 bg-default">
          <b-row align-v="center">
            <b-col>
              <b-img
                v-bind="thDefProps"
                thumbnail
                fluid
                id="thum-first"
                :src="getThumDefault1"
                alt="Image 1"
                @click="onClickThumDef($event)"
              ></b-img>
            </b-col>
            <b-col>
              <b-img
                v-bind="thDefProps"
                thumbnail
                id="thum-second"
                :src="getThumDefault2"
                @click="onClickThumDef($event)"
                alt="Image 2"
              ></b-img>
            </b-col>
            <b-col>
              <b-img
                v-bind="thDefProps"
                thumbnail
                fluid
                id="thum-third"
                :src="getThumDefault3"
                alt="Image 3"
                @click="onClickThumDef($event)"
              ></b-img>
            </b-col>
          </b-row>
        </b-container>
        <div class="file-props-thumbnail">
          <div class="file-props-thumbnail-left">
            <b-img
              v-bind="mainProps"
              :src="i_thumbnail"
              blank-color="#fff"
              thumbnail
              fluid-grow
              ref="thumb-img"
              alt="thumb_image"
            ></b-img>
            <div @click="deleteThumb" class="button btn-orange">{{ $t('label.delete') }}</div>
          </div>
          <div class="file-props-thumbnail-right">
            <form ref="fileform">
              <div class="upload-files-border">
                <span>{{ $t('label.drop_file_here') }}</span>
                <span>{{ $t('label.or') }}</span>
                <button
                  @click="onSelectFile($event)"
                  class="button btn-grey"
                >{{ $t('label.select_file') }}</button>
                <input
                  type="file"
                  id="file"
                  ref="customInput"
                  class="custom-file-input"
                  accept="image/*"
                  @change="addCustomFiles($event)"
                />
              </div>
            </form>
          </div>
        </div-->
        <div class="mt-3 border-bottom">
          <b-form-group
            :label="`${$t('files.id')}:`"
            label-cols="1"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="file-tag"
          >
            <div class="pt-2">
              <strong>{{ form.file_id }}</strong>
            </div>
          </b-form-group>

          <b-form-group
            :label="`${$t('files.file_title')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="file-title"
            :minLength="fieldsRestr.file_title.minLength"
            :invalid-feedback="validateErrorMessage('file_title')"
            :state="validateState('file_title')"
          >
            <b-form-input
              id="file-title"
              :placeholder="`${$t('files.file_title')}`"
              v-model="form.file_title"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="`${$t('files.tag')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="file-tag"
          >
            <b-form-input id="file-tag" :placeholder="`${$t('files.tag')}`" v-model="form.file_tag"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="`${$t('files.groups')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="file-groups"
          >
            <multiselect
              id="file-groups"
              class="multiselect"
              v-if="!isLoadingData"
              v-model="form.file_groups"
              :items="group_options"
              :placeholder="`${$t('label.group_is_not_selected')}`"
            />
          </b-form-group>
          <b-form-group
            :label="`${$t('files.series')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="file-series"
          >
            <multiselect
              id="file-series"
              class="multiselect"
              v-if="!isLoadingData"
              v-model="form.file_series"
              :items="series_options"
              :placeholder="`${$t('label.series_is_not_selected')}`"
            />
          </b-form-group>
          <b-form-group
            :label="`${$t('files.file_description')}:`"
            label-cols-sm="3"
            label-cols-lg="3"
            label-for="file-description"
          >
            <b-form-textarea
              :placeholder="`${$t('files.file_description')}`"
              v-model="form.file_description"
              wrap="hard"
            ></b-form-textarea>
          </b-form-group>
        </div>
        <div class="file-props-buttons">
          <button
            :disabled="isFilesInfoUpdating || dataUpdated"
            type="submit"
            class="button btn-blue"
          >{{ $t('label.registration') }}</button>
          <button
            @click="backToCatalog"
            class="button btn-braun"
          >{{ dataUpdated ? $t('label.back') : $t('label.cancel') }}</button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import multiselect from '@/components/elements/multiselect'
import validMix from '@/mixins/validation'

export default {
  name: 'file-props',
  mixins: [validMix],
  data() {
    return {
      mainProps: {width: 75, height: 75, class: 'm1'},
      validFormName: 'form',
      dataUpdated: false,
      file: '',
      form: {
        file_uuid: '',
        file_output_file: '',
        file_thumbnail: '',
        file_title: '',
        file_tag: '',
        file_description: '',
        file_groups: [],
        file_series: []
      },
      isFilesInfoUpdating: false,
      active_file_uuid: '',
      fileNotFound: false,
      group_options: [],
      isLoadingData: true,
      series_options: [],
      thDefProps: {
        center: true,
        fluidGrow: true,
        blank: this.isLoadingData,
        width: 75,
        height: 120,
        blankSrc: null,
        blankColor: '#ededed',
        blankWidth: 75,
        blankHeight: 75
      },
      thumbnailsDef: {
        first: undefined,
        second: undefined,
        third: undefined
      },
      emptyImg: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'
    }
  },

  created() {
    const cid = this.cid
    this.active_file_uuid = this.$route.params.uuid
    this.$store.dispatch('LOAD_GROUPS', {cid}).then((res) => {
      this.$store.commit('SET_GROUPS_IS_LOADING', false)
      const grpo = this.groups
        .filter((item) => item.deleted_at === '')
        .map((item) => {
          return {value: item.gid, text: item.name}
        })
      this.group_options = [...this.group_options, ...grpo]
    })

    this.$store.dispatch('LOAD_SERIES', {cid}).then((res) => {
      this.$store.commit('SET_SERIES_IS_LOADING', false)
      const srso = this.series
        .filter((item) => item.deleted_at === '')
        .map((item) => {
          return {value: item.sid, text: item.name}
        })
      this.series_options = [...this.series_options, ...srso]
    })

    this.$store.dispatch('LOAD_FILE_INFO_BY_UUID', this.active_file_uuid).then(
      (res) => {
        this.form = {...this.form, ...res}
        this.isLoadingData = false

        // Object.keys(this.thumbnailsDef).map(async (item, index) => {
        //   this.thumbnailsDef[item] = undefined
        //   try {
        //     const url = this.getThumDefault(index)
        //     const img = await this.loadThumbnailImage(url)

        //     this.thumbnailsDef[item] = img
        //   } catch (error) {}
        // })

        // this.$store
        //   .dispatch('LOAD_FILE_THUMBNAIL', this.active_file_uuid)
        //   .then((res) => {
        //     this.form.file_thumbnail = res.file_thumbnail
        //   })
      },
      (error) => {
        this.isLoadingData = false
        this.fileNotFound = true
        return
      }
    )
  },
  mounted() {
    // this.dragAndDropCapable = this.determineDragAndDropCapable()
    // if (this.dragAndDropCapable) {
    //   ;[
    //     'drag',
    //     'dragstart',
    //     'dragend',
    //     'dragover',
    //     'dragenter',
    //     'dragleave',
    //     'drop'
    //   ].forEach(
    //     function(evt) {
    //       this.$refs.fileform.addEventListener(
    //         evt,
    //         function(e) {
    //           e.preventDefault()
    //           e.stopPropagation()
    //         }.bind(this),
    //         false
    //       )
    //     }.bind(this)
    //   )
    //   this.$refs.fileform.addEventListener(
    //     'drop',
    //     function(e) {
    //       this.file = e.dataTransfer.files[0]
    //       if (this.file) {
    //         if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
    //           let reader = new FileReader()
    //           reader.addEventListener(
    //             'load',
    //             function() {
    //               this.form.file_thumbnail = reader.result
    //             }.bind(this),
    //             false
    //           )
    //           reader.readAsDataURL(this.file)
    //         }
    //       }
    //     }.bind(this)
    //   )
    // }
  },
  components: {
    multiselect
  },
  computed: {
    fileStorePath() {
      return this.form.file_output_file.match(/([a-z\d:].*\/|$)/gi)[0]
    },
    ...mapState({
      groups: (state) => state.Companies.Groups.list,
      series: (state) => state.Companies.Series.list,
      cid: (state) => state.Login.me.profile.company_id,
      fieldsRestr: (store) => store.FieldRestr.categories.files
    }),

    i_thumbnail() {
      return Boolean(this.form.file_thumbnail)
        ? this.form.file_thumbnail
        : require('@/assets/images/p-streamCMS-s.png')
    },
    getThumDefault1() {
      return !this.thumbnailsDef.first
        ? this.emptyImg
        : this.thumbnailsDef.first
    },
    getThumDefault2() {
      return !this.thumbnailsDef.second
        ? this.emptyImg
        : this.thumbnailsDef.second
    },
    getThumDefault3() {
      return !this.thumbnailsDef.third
        ? this.emptyImg
        : this.thumbnailsDef.third
    }
  },
  methods: {
    // validateState(name) {
    //   const {$dirty, $error} = this.$v.form[name]
    //   return $dirty ? ($error ? !$error : null) : null
    // },
    // validateErrorMessage(name) {
    //   let message = ''
    //   const {$params} = this.$v.form[name]

    //   Object.keys($params).forEach((param) => {
    //     if (!this.$v.form[name][param]) {
    //       message += this.$v.form[name].$params[param].msg
    //     }
    //   })
    //   return message
    // },
    onClickThumDef(evt) {
      const target = evt.target.id.split('-')[1]
      if (this.thumbnailsDef[target]) {
        this.form.file_thumbnail = this.thumbnailsDef[target]
      } else {
        return
      }
    },
    loadThumbnailImage(url) {
      return new Promise(function imgPromise(resolve, reject) {
        const imgElement = new Image()
        imgElement.crossOrigin = 'anonymous'
        imgElement.addEventListener('load', function imgOnLoad() {
          let canvas = document.createElement('canvas')
          canvas.width = this.width
          canvas.height = this.height

          let ctx = canvas.getContext('2d')
          ctx.drawImage(this, 0, 0)
          const dataURL = canvas.toDataURL('image/png')
          resolve(dataURL)
        })
        imgElement.addEventListener('error', function imgOnError() {
          reject()
        })
        imgElement.src = url
      })
    },
    errorLoadImage() {
      //console.log('error load image')
    },
    getThumDefault(num) {
      const timeset = [1, 5, 10]
      return `${this.fileStorePath}thumbnails/thumbnail-${timeset[num]}_0.png`
    },
    determineDragAndDropCapable() {
      var div = document.createElement('div')
      return (
        ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
        'FormData' in window &&
        'FileReader' in window
      )
    },
    deleteThumb() {
      this.file = ''
      this.form.file_thumbnail = ''
    },
    onSelectFile(evt) {
      evt.preventDefault()
      this.$refs.customInput.click()
    },
    backToCatalog(evt) {
      evt.preventDefault()
      Object.keys(this.form).forEach((key) => {
        this.form[key] = null
      })
      this.$emit('contentElementClick', '/files')
    },
    async onSubmit(evt) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.isFilesInfoUpdating = true
      try {
        await this.$store.dispatch('UPDATE_FILE_INFO', this.form)
        //await this.$store.dispatch('LOAD_FILE_LIST')
        this.dataUpdated = true
      } finally {
        this.isFilesInfoUpdating = false
      }
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
              this.form.file_thumbnail = reader.result
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
.file-props {
  display: flex;
  flex-direction: column;
  max-width: 550px;
  > span {
    padding: 10px 0;
    font-size: 20px;
    font-weight: 600;
  }
  .file-props-thumbnail {
    display: flex;
    .file-props-thumbnail-left {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 150px;
      img {
        height: 150px;
      }
      .button {
        margin-top: 10px;
      }
    }
    .file-props-thumbnail-right {
      margin-left: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 280px;
      height: 200px;
      background: #ededed;
      form {
        width: 90%;
        height: 90%;
        .upload-files-border {
          border: 1px dashed #000;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding: 30px;
          height: 100%;
          > span {
            font-size: 20px;
            margin-bottom: 10px;
          }
        }
        .custom-file-input {
          display: none;
        }
      }
    }
  }
  // .file-props-inputs {
  //   display: flex;
  //   flex-direction: column;
  //   //padding: 10px 0;
  //   .file-props-inputs-id {
  //     display: flex;
  //     p {
  //       min-width: 30px;
  //       font-weight: 600;
  //     }
  //   }
  //   input {
  //     margin-bottom: 10px;
  //     padding-left: 5px;
  //   }
  //   .multiselect {
  //     padding-bottom: 10px;
  //   }
  // }
  .file-props-buttons {
    display: flex;
    padding: 10px 0;
    > *.button {
      margin-right: 10px;
    }
  }
}

.file-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
