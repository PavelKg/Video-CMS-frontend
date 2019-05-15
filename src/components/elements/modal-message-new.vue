<template>
  <div class="message-new-block">
    <b-modal
      v-model="isShowModal"
      header-bg-variant="dark"
      header-text-variant="light"
      hide-footer
      centered
    >
      <div class="modal-subject">
        <div class="modal-subj-date">
          <span>{{ active_message ? active_message.subject : '' }}</span>
          <span>{{
            active_message ? mess_date_format(active_message.date) : ''
          }}</span>
        </div>
        <button class="button btn-grey">{{ $t('label.reply') }}</button>
      </div>
      <div class="modal-text">
        {{ active_message ? active_message.text : '' }}
      </div>
    </b-modal>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    isShowModal: Boolean
  },
  data() {
    return {
      isShowMe: this.isShowModal
    }
  },
  computed: {
    ...mapGetters(['active_message'])
  },
  methods: {}
}
</script>

<style lang="scss">
@import '@/assets/styles.scss';
</style>
