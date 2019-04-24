<template>
  <div>MNG-role {{ oper }}-{{role_selected}}</div>
</template>

<script>
import {mapGetters} from 'vuex'

const re = /\.(\w+)$/i

export default {
  name: 'role-mng-form',
  data(){
    return {

    }
  },
  methods: {
    
  },

  created() {},
  computed: {
    ...mapGetters(['userMenuActiveItem', 'role_selected']),
    oper() {
      return this.userMenuActiveItem.match(re)[1].split('_')[1]
    }
  }
}
</script>

<style lang="scss"></style>
