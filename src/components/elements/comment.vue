<template>
  <div class="comment-row">
    <template v-if="isDeleted">
      <span class="deleted_info">{{
        $t('message.this_comment_has_been_deleted')
      }}</span>
    </template>
    <template v-else>
      <div class="comment-data">
        <div class="comment-top-zone">
          <span>{{ `${$t('comments.id')}: ${comment.comment_user_uid}` }}</span>
          <span>{{ created_date(comment.created_at) }}</span>
        </div>
        <div class="comment-bottom-zone">
          <span>{{ comment.comment_text }}</span>
        </div>
      </div>

      <div class="comment-mng" >
        <template v-if="!isUser">
          <b-form-radio-group
            size="sm"
            :id="`radio-visible-set-${comment.comment_id}`"
            :checked="visible_status(comment.comment_visible)"
            @change="onChangeVisible"
            :options="options"
            :name="`radio-visible-set-${comment.comment_id}`"
            class="radio-group-zone"
          >
          </b-form-radio-group
        ></template>
        <template v-if="commentOwner || !isUser">
          <button @click="onDelete" class="button btn-orange">
            {{ $t('label.delete') }}
          </button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'comment-template',
  props: {comment: Object, video_uuid: String},
  created() {},
  data() {
    return {
      options: [
        {text: this.$t('comments.display'), value: 'visible'},
        {text: this.$t('comments.hidden'), value: 'hidden'}
      ]
    }
  },
  computed: {
    ...mapGetters(['me']),
    isDeleted() {
      return Boolean(this.comment.deleted_at)
    },
    commentOwner() {
      const {company_id, uid, irole} = this.me.profile
      return (
        this.comment.comment_user_uid === uid 
      )
    },
    isUser() {
      return this.me.profile.irole === 'user'
    }
  },
  methods: {
    created_date(item) {
      return item
        ? new Date(item)
            .toISOString()
            .slice(0, 16)
            .replace(/\-/gi, '/')
            .replace(/T/gi, ' ')
        : ''
    },
    onChangeVisible(_value) {
      const uuid = this.video_uuid
      const comid = this.comment.comment_id
      const value = Boolean(_value === 'visible')
      this.$store.dispatch('CHANGE_COMMENT_VISIBLE', {uuid, comid, value})
    },
    visible_status(item) {
      return item ? 'visible' : 'hidden'
    },
    onDelete() {
      const uuid = this.video_uuid
      const comid = this.comment.comment_id
      this.$store.dispatch('DELETE_COMMENT', {uuid, comid})
    }
  }
}
</script>

<style lang="scss">
.radio-group-zone {
  .custom-radio {
    //margin-right: 0;
  }
}
.deleted_info {
  font-size: 0.9em;
  margin-right: 15px;
  opacity: 0.7;
  font-style: italic;
}
.comment-row {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #dcdcdc;
  justify-content: flex-start;
  padding: 5px;
  .comment-data {
    .comment-top-zone {
      span {
        font-size: 0.9em;
        margin-right: 15px;
      }
    }
    .comment-bottom-zone {
      font-style: italic;
    }
  }
  .comment-mng {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .button {
      max-width: 100px;
    }
  }
}
</style>
