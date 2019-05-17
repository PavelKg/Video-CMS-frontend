<template>
  <div class="message-new-block"></div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    isShowModal: Boolean
  },
  data() {
    return {}
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
