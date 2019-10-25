<template>
  <div class="group-operation">
    <template v-if="groupNotFound">
      <div class="group-not-found">
        <span>Sorry. Group is not found!!!</span><br />
        <button @click="cancel_click" class="button btn-braun">
          {{ $t('label.back') }}
        </button>
      </div>
    </template>
    <template v-else>
      <p>{{ $t(group_title) }}</p>
      <div class="group-oper-id">
        <div class="group-oper-id-data">
          <p>{{$t('groups.id')}}:</p>
          <p>{{ `g_${mnGroup.gid}` }}</p>
        </div>
        <div class="group-oper-id-data">
          <p v-if="oper === 'edit'">{{ `${$t('groups.name')}` }}:</p>
          <b-form-input
            v-model="mnGroup.name"
            :placeholder="`${$t('groups.group_name')}`"
            :disabled="group_is_deleted"
          ></b-form-input>
          <button
            :disabled="mnGroup.name === src_name || group_is_deleted"
            @click="save_click"
            class="button btn-blue"
          >
            {{ `${$t('label.register')}` }}
          </button>
        </div>
      </div>
      <template v-if="oper === 'edit' && !group_is_deleted">
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
    </template>
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
        gid: null,
        deleted_at: ''
      },
      groupNotFound: false
    }
  },
  methods: {
    contentElementClick(menu_item) {
      this.$emit('contentElementClick', menu_item)
    },
    cancel_click() {
      this.contentElementClick('/hub/groups')
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

    this.mnGroup.gid = +gid
    const cid = this.me.profile.company_id

    if (this.oper === 'edit') {
      this.$store.dispatch('LOAD_GROUP_INFO', {cid, gid}).then(
        (group) => {
          this.src_name = group.name
          this.mnGroup = {...this.mnGroup, ...group}

          const params = {
            cid,
            filter: `user_groups[ol]: ARRAY[${gid}]`
          }
          this.$store
            .dispatch('LOAD_USERS', params)
            .then(() => this.$store.commit('SET_USERS_IS_LOADING', false))
        },
        (error) => {
          this.groupNotFound = true
          return
        }
      )
    }
  },
  computed: {
    ...mapGetters(['userMenuActiveItem', 'me']),
    group_title() {
      return `groups.oper_title_${this.oper}`
    },
    group_is_deleted() {
      return Boolean(this.mnGroup.deleted_at)
    }
  }
}
</script>

<style lang="scss">
.group-operation {
  display: flex;
  flex-direction: column;
  > p {
    font-size: 1.8em;
    font-weight: 600;
  }
  > * {
    margin-bottom: 20px;
  }
  .group-oper-id {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1.2em;
    p {
      min-width: 90px;
    }
    .group-oper-id-data {
      display: flex;
      justify-content: center;
      font-size: 1.2em;
    }
  }
  input {
    margin-right: 10px;
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
.group-not-found {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 30px;
  font-size: 1.2rem;
}
</style>
