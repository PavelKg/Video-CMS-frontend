<template>
  <div class="group-operation">
    <span>{{ $t(group_title) }}</span>
    <div class="group-oper-id">
      <span v-if="oper === 'edit'">{{ `${$t('groups.name')}` }}:</span>
      <b-form-input
        v-model="mnGroup.name"
        :placeholder="`${$t('groups.group_name')}`"
      ></b-form-input>
      <button
        :disabled="mnGroup.name === src_name"
        @click="save_click"
        class="button btn-blue"
      >
        {{ `${$t('label.register')}` }}
      </button>
    </div>
    <template v-if="oper === 'edit'">
      <TableUsersLite
        :gid="mnGroup.gid"
        @contentElementClick="contentElementClick"
      />
    </template>
    <template v-else-if="oper === 'add'"> </template>
    <div class="group-operation-button-zone">
      <button @click="cancel_click" class="button btn-braun">
        {{ `${$t('label.cancel')}` }}
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import TableUsersLite from '@/components/elements/table-users-lite'

export default {
  name: 'group-mng-form',
  components: {
    TableUsersLite
  },
  props: {
    oper: String
  },
  data() {
    return {
      src_name: '',
      mnGroup: {
        name: '',
        gid: ''
      }
    }
  },
  methods: {
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    cancel_click() {
      this.$router.go(-1)
    },
    save_click() {
      const oper_type = this.oper === 'edit' ? 'GROUP_UPD' : 'GROUP_ADD'
      this.$store.dispatch(oper_type, this.mnGroup).then(
        (res) => {
          this.contentElementClick('/hub/groups')
        },
        (err) => {
          console.log('err=', err)
        }
      )
    }
  },

  created() {
    const {gid = null} = this.$route.params
    this.mnGroup.gid = gid
    const cid = this.me.profile.company_id

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_GROUP_INFO', {cid, gid}).then((group) => {
        this.src_name = group.name
        this.mnGroup.name = group.name
      })
      const params = {
        cid,
        filter: `group_gid[eq]:'${gid}'`
      }
      this.$store
        .dispatch('LOAD_USERS', params)
        .then(() => this.$store.commit('SET_USERS_IS_LOADING', false))
    }
  },
  computed: {
    ...mapGetters(['userMenuActiveItem', 'me']),
    group_title() {
      return `groups.oper_title_${this.oper}`
    }
  }
}
</script>

<style lang="scss">
.group-operation {
  display: flex;
  flex-direction: column;
  > span {
    font-size: 1.8em;
    font-weight: 600;
  }
  > * {
    margin-bottom: 20px;
  }
  .group-oper-id {
    display: flex;
    align-items: center;
    font-size: 1.2em;
  }
  input {
    margin: 0 10px;
    max-width: 400px;
  }
  .check-admin {
    display: flex;
    justify-content: space-between;
    max-width: 400px;

    > * {
      margin-right: 10px;
    }
  }
  .group-operation-button-zone {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 30px;

    .button {
      margin-right: 10px;
    }
  }
}
</style>
