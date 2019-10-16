<template>
  <div class="file-listing">
    {{ `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} Mb)` }}
    <div v-if="value === 0 && !uploaded && !uploading" class="remove-container">
      <a href="#" class="remove" @click="removeMe">{{ $t('label.remove') }}</a>
    </div>
    <b-progress
      class="upload-progress"
      v-else
      :value="uploaded ? 100 : value"
      :max="max"
      show-progress
      :animated="animate"
    ></b-progress>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      value: 0,
      max: 100,
      animate: true
    }
  },
  props: {
    file: File,
    uuid: String,
    uploaded: Boolean,
    uploading: Boolean
  },
  created() {
    this.$store.commit('PROGRESS_UPLOAD_FILE', {
      name: this.file.name,
      progress_handler: this.uplProgress
    })
  },
  methods: {
    removeMe() {
      this.$store.commit('DEL_UPLOAD_FILE', this.file.name)
    },
    uplProgress(val) {
      if (val === 100) {
        this.$store.commit('SET_UPLOADED_FILE', this.uuid)
        this.animate = false
      }
      this.value = val
    }
  },
  computed: {
    // ...mapGetters({isUploading: 'videoIsUploading'})
  }
}
</script>

<style lang="scss">
@import '../../assets/styles';

.file-listing {
  display: flex;
  justify-content: space-between;
  width: 400px;
  margin-top: auto;
  padding: 10px 0;
  border-bottom: 1px solid $gray-lighter;
  div.remove-container {
    text-align: center;
  }

  div.remove-container a {
    color: red;
    cursor: pointer;
  }
  .upload-progress {
    min-width: 10em;
  }
}
</style>
