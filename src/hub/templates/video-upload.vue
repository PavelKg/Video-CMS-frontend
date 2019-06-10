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
    <FileUploadItem
      v-for="(file, key) in files"
      :key="key"
      :id="key"
      :file="file"
    />
    <div class="video-upload-buttons">
      <button
        class="button btn-blue"
        @click="submitFiles()"
        :class="{'btn-disabled': files.length === 0}"
      >
        {{ $t('label.upload') }}
      </button>
      <button @click="backToCatalog" class="button btn-blue">
        {{ $t('label.cancel') }}
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FileUploadItem from '@/components/elements/file-upload-item'

export default {
  name: 'upload-file',
  data() {
    return {
      dragAndDropCapable: false
    }
  },
  computed: {
    ...mapGetters({files: 'files_for_upload'})
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
          console.log('drop files=', e.dataTransfer.files)
          this.$store.commit('ADD_UPLOAD_FILE', e.dataTransfer.files)
          // for (let i = 0; i < e.dataTransfer.files.length; i++) {
          //   this.files.push(e.dataTransfer.files[i])
          // }
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
    // removeFile(key) {
    //   this.files.splice(key, 1)
    // },
    addCustomFiles(evt) {
      //this.files = [...this.files, ...event.target.files]
      console.log('evt=', evt)
      this.$store.commit('ADD_UPLOAD_FILE', evt.target.files)
    },
    selectCustomFiles() {
      this.$refs.customInput.click()
    },
    backToCatalog() {
      this.$store.commit('CLEAR_UPLOAD_FILES')
      this.$emit('contentElementClick', 'root.subItems.home')
    },
    submitFiles() {
      let formData = new FormData()
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i]

        formData.append('files[' + i + ']', file)
      }

      this.$store
        .dispatch('UPLOAD_VIDEO_FILES', formData)
        .then(res => {})
        .catch(err => {})
    }
  },
  components: {
    FileUploadItem
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

  .video-upload-buttons {
    display: flex;
    padding: 10px 0;
    > .button {
      margin-right: 10px;
    }
  }
}
</style>
