import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      permitsCategory: ''
    }
  },
  methods: {
    isActAllow(act) {
      return this.permits.includes(act)
    }
  },
  computed: {
    ...mapGetters(['subMenuItem']),
    permits() {
      const subItem = this.subMenuItem(this.permitsCategory)
      const res =
        subItem && subItem.hasOwnProperty('subItems')
          ? Object.keys(subItem['subItems'])
          : []
      return res
    }
  }
}
