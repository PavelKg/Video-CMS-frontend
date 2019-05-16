<template>
  <div class="message-new-block">
    <b-modal
      :visible="isShowMe"
      @change="modalChangeState"
      header-bg-variant="dark"
      header-text-variant="light"
      hide-footer
      centered
    >
      <div class="modal-subject">
        <div class="modal-subj-date">
          <span>{{}}</span>
        </div>
      </div>
      <div class="modal-text"></div>
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
      
    }
  },
  computed: {
    ...mapGetters(['active_message']),
    isShowMe() {
      return this.isShowModal
    } 
  },
  methods: {
    modalChangeState(evt) {
      console.log('modalChangeState=', evt)
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles.scss';
</style>
