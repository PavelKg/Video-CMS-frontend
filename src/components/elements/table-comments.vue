<template>
  <div class="comment-table">
    <div class="table-row" v-for="(comment, idx) in comment_list" :key="idx">
      <div class="table-row-top">
        <span>ID: {{ comment.author }}</span>
        <span>Date: {{ comment.date.toLocaleDateString('en-US') }}</span>
      </div>
      <div class="table-row-bottom">
        <span>{{ comment.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'table-comments',
  props: {
    comments: Object
  },
  methods: {},
  computed: {
    ...mapGetters(['comment_list'])
  }
}
</script>

<style lang="scss" scoped>
.comment-table {
  height: 300px;
  overflow: auto;
  .table-row {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #dcdcdc;
    .table-row-top {
      font-weight: bold;
      span {
        padding-right: 10px;
      }
    }
    .table-row-bottom {
      font-style: italic;
    }
  }
}
</style>
