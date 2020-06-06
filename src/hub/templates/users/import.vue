<template>
  <div class="import-operation">
    <span>{{ $t("users.title_import") }}</span>
    <b-container class="pl-0 mt-2">
      <b-form @submit.stop.prevent="onSubmit">
        <b-form-file
          v-model="file"
          :placeholder="$t('label.choose_file_or_drop_it_here')"
          :drop-placeholder="$t('label.drop_file_here')"
          :browse-text="$t('label.browse')"
          accept=".csv, text/csv"
          @change="onFileChange"
        ></b-form-file>
        <div class="my-3">{{`${$t('users.import_status')}: ${usersImportStatus}`}}</div>
        <div class="d-flex mt-2">
          <button
            :disabled="!Boolean(file) || usersImportStatus!==''"
            type="submit"
            class="button btn-blue mr-2"
          >{{ `${$t('label.save')}` }}</button>

          <button class="button btn-braun" @click="onBack">{{ `${$t('label.back')}` }}</button>
        </div>
      </b-form>
    </b-container>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  name: 'users_import',
  data() {
    return {
      file: undefined
    }
  },
  mounted() {
    if (!this.file) {
      this.$store.commit('SET_IMPORT_STATUS', '')
    }
  },
  methods: {
    onBack(evt) {
      evt.preventDefault()
      this.$emit('contentElementClick', '/users')
    },
    onSubmit() {
      this.$store.dispatch('USER_IMPORT', this.file)
    },
    onFileChange() {
      this.$store.commit('SET_IMPORT_STATUS', '')
    }
  },
  computed: {
    ...mapState({
      usersImportStatus: (store) => store.Users.usersImportStatus
    })
  }
}
</script>

<style lang="scss">
.import-operation {
  max-width: 550px;
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }
}
</style>