<template>
  <div class="video-subtitles">
    <span>{{ $t('label.edit_video') }}</span>
    <span>{{ $t('label.thumb_image_upload') }}</span>
    <form ref="subtitlesForm" @submit.prevent="onSubmit">
      <div class="video-subtitles-thumbnail">
        <div class="video-subtitles-thumbnail-left">
          <b-img
            v-bind="mainProps"
            blank-color="#fff"
            thumbnail
            fluid-grow
            ref="thumb-img"
            alt="thumb_image"
          ></b-img>
          <div @click="deleteThumb" class="button btn-orange">
            {{ $t('label.delete') }}
          </div>
        </div>
        <div class="video-subtitles-thumbnail-right">
          <form ref="fileform">
            <div class="upload-files-border">
              <span>{{ $t('label.drop_file_here') }}</span>
              <span>{{ $t('label.or') }}</span>
              <div @click="selectCustomFiles" class="button btn-grey">
                {{ $t('label.select_file') }}
              </div>
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
      </div>
      <div class="video-subtitles-inputs">
        <b-form-input
          placeholder="VideoTitle"
          v-model="form.title"
        ></b-form-input>
        <b-form-input placeholder="Tag" v-model="form.tag"></b-form-input>
        <b-form-textarea
          placeholder="Video description"
          v-model="form.descr"
        ></b-form-textarea>
      </div>
      <div class="video-subtitles-buttons">
        <button type="submit" class="button btn-blue">
          {{ $t('label.registration') }}
        </button>
        <button @click="backToCatalog" class="button btn-braun">
          {{ $t('label.cancel') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'video-subtitles',
  data() {
    return {
      mainProps: {blank: true, width: 75, height: 75, class: 'm1'},
      file: '',
      imagePreview: null,
      form: {
        thumb: '',
        title: '',
        tag: '',
        descr: ''
      }
    }
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable()

    if (this.dragAndDropCapable) {
      ;[
        'drag',
        'dragstart',
        'dragend',
        'dragover',
        'dragenter',
        'dragleave',
        'drop'
      ].forEach(
        function(evt) {
          this.$refs.fileform.addEventListener(
            evt,
            function(e) {
              e.preventDefault()
              e.stopPropagation()
            }.bind(this),
            false
          )
        }.bind(this)
      )

      this.$refs.fileform.addEventListener(
        'drop',
        function(e) {
          this.file = e.dataTransfer.files[0]
        }.bind(this)
      )
    }
  },
  methods: {
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
      this.$refs['thumb-img'].src =
        'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    },
    selectCustomFiles() {
      this.$refs.customInput.click()
    },
    backToCatalog() {
      this.$emit('contentElementClick', 'root.subItems.home')
    },
    onButtonReg() {
      this.$refs['subtitlesForm'].onSubmit
    },
    onSubmit(evt) {
      evt.preventDefault()
      this.form.thumb = this.$refs['thumb-img'].src
    },
    addCustomFiles() {
      this.file = event.target.files[0]

      if (this.file) {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          let reader = new FileReader()

          reader.addEventListener(
            'load',
            function() {
              this.$refs['thumb-img'].src = reader.result
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
.video-subtitles {
  display: flex;
  flex-direction: column;
  width: 450px;
  > span {
    padding: 10px 0;
    font-size: 20px;
    font-weight: 600;
  }
  .video-subtitles-thumbnail {
    display: flex;
    .video-subtitles-thumbnail-left {
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
    .video-subtitles-thumbnail-right {
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
  .video-subtitles-inputs {
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    input {
      margin: 10px 0;
      padding-left: 5px;
    }
  }
  .video-subtitles-buttons {
    display: flex;
    padding: 10px 0;
    > *.button {
      margin-right: 10px;
    }
  }
}
</style>
