export default {
  data() {
    return {
      scrolled: false,
      isScrollable: false
    }
  },
  updated() {
    const elTable = document.querySelector('table')
    const parentTable = elTable.parentNode
    this.isScrollable =
      elTable.scrollWidth > parentTable.offsetWidth ? true : false
  },
  methods: {
    onTableScrolled() {
      this.scrolled = true
    }
  }
}
