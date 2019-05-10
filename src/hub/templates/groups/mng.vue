<template>
  <div class="group-operation">
    <span>{{ $t(group_title) }}</span>
    <div class="group-oper-id">
      <span v-if="oper === 'edit'">{{ `${$t('groups.group_name')}` }}:</span>
      <b-form-input
        v-model="mnGroup.name"
        placeholder="Group Name"
      ></b-form-input>
    </div>
    <template v-if="oper === 'edit'">
      <TableUsersLite /> </template>
    <template v-else-if="oper === 'add'"> </template>
    <div class="group-operation-button-zone">
      <button @click="save_click" class="button btn-blue">Save</button>
      <button @click="cancel_click" class="button btn-blue">Cancel</button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import TableUsersLite from '@/components/elements/table-users-lite'

const re = /\.(\w+)$/i

export default {
  name: 'group-mng-form',
  components: {
    TableUsersLite
  },
  data() {
    return {
      mnGroup: {
        name: '',
        gid: ''
      }
    }
  },
  methods: {
    cancel_click() {
      this.$emit('contentElementClick', 'root.subItems.groups')
    },
    save_click() {
      const oper_type = this.oper === 'edit' ? 'GROUP_UPD' : 'GROUP_ADD'
      this.$store.dispatch(oper_type, this.mnGroup).then(
        res => {
          this.$emit('contentElementClick', 'root.subItems.groups')
        },
        err => {
          console.log('err=', err)
        }
      )
    }
  },

  created() {
    if (this.oper === 'edit') {
      this.mnGroup = {...this.group_selected}
    }
  },
  computed: {
    ...mapGetters(['userMenuActiveItem', 'group_selected']),
    oper() {
      return this.userMenuActiveItem.match(re)[1].split('_')[1]
    },
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
