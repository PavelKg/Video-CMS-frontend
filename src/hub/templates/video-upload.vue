<template>
  <div class="video-upload-zone">
    <span>{{ $t('label.video_upload') }}</span>
    <div class="video-upload-files">
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
            multiple
            @change="addCustomFiles($event)"
          />
        </div>
      </form>
    </div>
    <div v-for="(file, key) in files" :key="key" class="file-listing">
      {{ `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} Mb)` }}
      <div class="remove-container">
        <a href="#" class="remove" @click="removeFile(key)">{{
          $t('label.remove')
        }}</a>
      </div>
    </div>
    <div class="video-upload-buttons">
      <div
        @click="submitFiles()"
        class="button btn-blue"
        :class="{'btn-disabled': files.length === 0}"
      >
        {{ $t('label.upload') }}
      </div>
      <div @click="backToCatalog" class="button btn-blue">
        {{ $t('label.cancel') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'upload-file',
  data() {
    return {
      dragAndDropCapable: false,
      files: []
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
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            this.files.push(e.dataTransfer.files[i])
          }
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
    removeFile(key) {
      this.files.splice(key, 1)
    },
    addCustomFiles() {
      this.files = [...this.files, ...event.target.files]
    },
    selectCustomFiles() {
      this.$refs.customInput.click()
    },
    backToCatalog() {
      this.$emit('contentElementClick', 'root.subItems.home')
    },
    submitFiles() {
      let formData = new FormData()

      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        formData.append('files[' + i + ']', file)
      }

      this.$store.dispatch('UPLOAD_VIDEO_FILES', formData)
        .then(res => {})
        .catch(err => {})
      // axios
      //   .post('/file-drag-drop', formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data'
      //     }
      //   })
      //   .then(function() {
      //     console.log('SUCCESS!!')
      //   })
      //   .catch(function() {
      //     console.log('FAILURE!!')
      //   })
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';

.video-upload-zone {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  > span {
    font-size: 24px;
    font-weight: 700;
  }
  .video-upload-files {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 300px;
    margin: 10px 0;
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
  .file-listing {
    display: flex;
    justify-content: space-between;
    width: 400px;
    margin-top: auto;
    padding: 10px;
    border-bottom: 1px solid $gray-lighter;
    div.remove-container {
      text-align: center;
    }

    div.remove-container a {
      color: red;
      cursor: pointer;
    }
  }
  .video-upload-buttons {
    display: flex;
    padding: 10px 0;
    > .button {
      margin-right: 10px;
    }
  }
}
</style>
