<template>
  <div>
    <b-container class="px-0 mx-0">
      <b-row align-v="center" align-h="between">
        <b-col cols="5" class="mb-2 pr-0">
          <b-table
            class="scroll-table"
            responsive
            striped
            sticky-header
            head-variant="dark"
            :items="nomember_list"
            :fields="table_fields"
            selectable
            @row-selected="onSourceRowSelected"
            :sort-by.sync="sortNoMemBy"
            :sort-desc.sync="sortNoMemDesc"
            tbody-tr-class="tr-drag-and-drop"
            :busy="isSourceBusy"
          >
            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>{{ `${$t('label.loading')}...` }}</strong>
              </div>
            </template>
            <template v-slot:cell(id)="row">
              <div
                :class="{'mem-removed bg-danger text-light': row.item.binded}"
              >
                {{ row.item.id }}
              </div>
            </template>
            <template v-slot:cell(name)="row">
              <div class="truncate-text">{{ row.item.name }}</div>
            </template>
          </b-table>
        </b-col>
        <b-col cols="0" class="p-0 justify-content-md-center buttom-column">
          <b-button
            class="m-1"
            variant="outline-secondary"
            v-html="'>'"
            @click="moveToMember"
          ></b-button>
          <b-button
            class="m-1"
            variant="outline-secondary"
            v-html="'<'"
            @click="moveToNoMember"
          ></b-button
        ></b-col>
        <b-col cols="5" class="mb-2 pl-0">
          <b-table
            responsive
            striped
            sticky-header
            head-variant="dark"
            :items="member_list"
            :fields="table_fields"
            selectable
            :sort-by.sync="sortMemBy"
            :sort-desc.sync="sortMemDesc"
            @row-selected="onTargetRowSelected"
            class="scroll-table"
            :busy="isTargetBusy"
          >
            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>{{ `${$t('label.loading')}...` }}</strong>
              </div>
            </template>
            <template v-slot:cell(id)="row">
              <div
                :class="{'mem-added bg-success text-light': !row.item.binded}"
              >
                {{ row.item.id }}
              </div>
            </template>
            <template v-slot:cell(name)="row">
              <div class="truncate-text">{{ row.item.name }}</div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    binding_data: Array,
    isLoadingData: Boolean,
    value: {
      type: Array
    }
  },
  watch: {
    isLoadingData(newVal) {
      this.isSourceBusy = newVal
      this.isTargetBusy = newVal
    },
    binding_data(newVal) {
      if (Array.isArray(newVal) && newVal.length > 0) {
        newVal.forEach((element) => {
          if (element.binded) {
            this.member_list.push(element)
          } else {
            this.nomember_list.push(element)
          }
        })
      } else {
        this.member_list = []
        this.nomember_list = []
      }
      this.$emit('change', [])
    }
  },
  data() {
    return {
      source_table_items: [],
      table_fields: [
        {
          key: 'id',
          label: 'ID',
          sortable: true,
          class: 'text-center'
        },
        {key: 'name', label: 'Name', sortable: true, class: 'text-center'}
      ],
      nomember_list: this.binding_data.filter((item) => {
        return !item.binded
      }),
      member_list: this.binding_data.filter((item) => {
        return item.binded
      }),
      target_table_items: [],
      sortNoMemBy: 'id',
      sortNoMemDesc: false,
      sortMemBy: 'id',
      sortMemDesc: false,
      noMembersSelected: [],
      membersSelected: [],
      isSourceBusy: false,
      isTargetBusy: false
    }
  },
  methods: {
    onSourceRowSelected(evt) {
      this.noMembersSelected = evt
    },
    onTargetRowSelected(evt) {
      this.membersSelected = evt
    },
    diffMemebers() {
      const noMembers = this.nomember_list
        .filter((item) => Boolean(item.binded))
        .map((item) => {
          return {...item, list: 'removed'}
        })
      const members = this.member_list
        .filter((item) => !Boolean(item.binded))
        .map((item) => {
          return {...item, list: 'added'}
        })
      this.$emit('change', [...noMembers, ...members])
    },
    moveToMember() {
      this.noMembersSelected.forEach((item) => {
        const ind = this.nomember_list.findIndex((elem) => {
          if (elem.id === item.id) {
            return true
          }
        })
        if (ind > -1) {
          this.member_list.push(item)
          this.nomember_list.splice(ind, 1)
        }
      })
      this.diffMemebers()
    },
    moveToNoMember() {
      this.membersSelected.forEach((item) => {
        const ind = this.member_list.findIndex((elem) => {
          if (elem.id === item.id) {
            return true
          }
        })
        if (ind > -1) {
          this.nomember_list.push(item)
          this.member_list.splice(ind, 1)
        }
      })
      this.diffMemebers()
    }
  },
  computed: {}
}
</script>
<style lang="scss">
.mem-removed {
  //background: red;
  font-weight: 600;
}
.mem-added {
  background: green;
  font-weight: 600;
}
.tr-drag-and-drop {
  draggable: 'true';
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
}
.truncate-text {
  max-width: 320px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.nowrap {
  display: flex;
  flex-wrap: nowrap;
}
.buttom-column {
  flex-direction: column;
  max-width: 70px;
  align-items: center;
  display: flex;
}
.scroll-table {
  min-height: 300px;
  border: 1px solid #dadada;
}
</style>
