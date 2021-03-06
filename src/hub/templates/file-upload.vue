<template>
  <div class="file-upload-zone">
    <span>{{ $t('label.files_upload') }}</span>
    <div class="upload-files">
      <form ref="fileform">
        <div class="upload-files-border">
          <span>{{ $t('label.drop_file_here') }}</span>
          <span>{{ $t('label.or') }}</span>
          <button @click="selectCustomFiles" class="button btn-grey">{{ $t('label.select_file') }}</button>
          <input
            type="file"
            id="file"
            ref="customInput"
            class="custom-file-input"
            multiple
            :accept="allowFileTypes.join(',')"
            @change="addCustomFiles($event)"
          />
        </div>
      </form>
    </div>
    <FileUploadItem
      class="upload-file-desc"
      v-for="(up_file, key) in files_for_upload"
      :key="key"
      :uuid="up_file.uuid"
      :file="up_file.file"
      :uploaded="up_file.uploaded"
      :uploading="up_file.isUploading"
      :upProgress="up_file.progress"
      @removed="removedItemFromList"
      @uploaded="uploadedItem"
    ></FileUploadItem>
    <div class="file-upload-buttons">
      <button
        class="button btn-blue"
        @click="submitFiles()"
        :class="{
          'btn-disabled':
            hasUpload.length === 0 || isProcessingUpload.length !== 0
        }"
      >{{ $t('label.upload') }}</button>
      <button @click="backToCatalog" class="button btn-blue">{{ $t('label.cancel') }}</button>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import FileUploadItem from '@/components/elements/file-upload-item'

export default {
  name: 'upload-file',
  data() {
    return {
      dragAndDropCapable: false,
      allowFileTypes: [
        'video/*',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'audio/*',
        'image/*'
      ]
    }
  },
  computed: {
    ...mapState({
      files_for_upload: (state) => state.Files.filesForUpload.list
    }),
    hasUpload() {
      return this.files_for_upload.filter((file) => !Boolean(file.uploaded))
    },
    isProcessingUpload() {
      return this.files_for_upload.filter((file) => Boolean(file.isUploading))
    }
  },
  created() {
    this.$store.commit('CLEAR_UPLOAD_FILES')
  },
  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable()
    if (this.dragAndDropCapable) {
      const allowActions = [
        'drag',
        'dragstart',
        'dragend',
        'dragover',
        'dragenter',
        'dragleave',
        'drop'
      ]

      allowActions.forEach(
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
          const file_types = this.allowFileTypes.join('|').replace(/\//g, '\\/')
          const re = new RegExp(`^${file_types}`, 'i')
          const fileList = [...e.dataTransfer.files]
          const dropFiles = fileList.filter((item) => re.test(item.type))
          if (dropFiles.length) {
            this.$store.commit('ADD_UPLOAD_FILE', dropFiles)
          }
        }.bind(this)
      )
    }
  },
  methods: {
    uploadedItem(uuid) {
      this.$store.commit('SET_UPLOADED_FILE', uuid)
    },

    removedItemFromList(filename) {
      this.$store.commit('DEL_UPLOAD_FILE', filename)
    },
    determineDragAndDropCapable() {
      const div = document.createElement('div')
      return (
        ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
        'FormData' in window &&
        'FileReader' in window
      )
    },
    // removeFile(key) {
    //   this.files.splice(key, 1)
    // },
    addCustomFiles(evt) {
      const file_types = this.allowFileTypes.join('|').replace(/\//g, '\\/')
      const re = new RegExp(`^${file_types}`, 'gi')
      const dropFiles = [...evt.target.files].filter((item) =>
        re.test(item.type)
      )
      if (dropFiles.length) {
        this.$store.commit('ADD_UPLOAD_FILE', dropFiles)
      }
    },
    selectCustomFiles(evt) {
      evt.preventDefault()
      this.$refs.customInput.click()
    },
    backToCatalog() {
      //this.$store.commit('CLEAR_UPLOAD_FILES')
      //this.$emit('contentElementClick', '/videos')
      this.$router.go(-1)
    },
    submitFiles() {
      this.$store
        .dispatch('UPLOAD_FILES' /*, formData*/)
        .then((res) => {})
        .catch((err) => {})
    }
  },
  components: {
    FileUploadItem
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';

.file-upload-zone {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  > span {
    font-size: 24px;
    font-weight: 700;
  }
  .upload-files {
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
        justify-content: center;
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

  .file-upload-buttons {
    display: flex;
    padding: 10px 0;
    > .button {
      margin-right: 10px;
    }
  }
}

@media screen and (max-width: 610px) {
  .upload-file-desc {
    width: 100%;
  }
  .file-upload-zone {
    .upload-files {
      width: 100%;
    }
  }
}
</style>
