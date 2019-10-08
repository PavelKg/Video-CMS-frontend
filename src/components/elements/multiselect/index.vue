<template>
  <div class="multiselect">
    <div
      :id="`multiselect-tablo-${ucode}`"
      class="multiselect-tablo elem-borders"
      @click="onOpenMultiselect"
    >
      <template v-if="selected.length === 0">
        <p :id="`ms-placeholder-${ucode}`" style="opacity:0.5">
          {{ placeholder }}
        </p>
      </template>
      <template v-else>
        <p :id="`ms-selected-${ucode}`" v-html="selectedList"></p>
      </template>

      <IconBase
        class="ms-dd-icon rotating"
        :class="{'rotating-opened': selectIsOpen}"
        :icon-color="icon_color"
      >
        <IconChevron />
      </IconBase>
    </div>
    <template v-if="selectIsOpen">
      <div
        :id="`ms-list-${ucode}`"
        key="username-input"
        v-closable="{
          exclude: [
            `multiselect-tablo-${ucode}`,
            `ms-list-${ucode}`,
            `ms-placeholder-${ucode}`,
            `ms-selected-${ucode}`
          ],
          handler: 'onHideList'
        }"
        class="multiselect-list elem-borders"
        :class="{'multiselect-list-open': selectIsOpen}"
      >
        <div class="multiselect-search ms-items">
          <input
            :value="search_string"
            @input="search_string = $event.target.value"
            :placeholder="`${$t('label.keyword_search')}`"
          />
          <span v-show="search_string.length > 0" @click="onClearSearch">
            X
          </span>
        </div>
        <div class="multiselect-check-all ms-items">
          <template v-if="filteredItems.length">
            <ul>
              <li
                @click.prevent="
                  onSelectAll(
                    groups_selectAll === 'selectAll' &&
                      groups_selectAll !== false
                      ? 'unSelectAll'
                      : 'selectAll'
                  )
                "
              >
                <ItemContent>
                  <template #item-check>
                    <b-form-checkbox
                      value="selectAll"
                      v-model="groups_selectAll"
                      unchecked-value="unSelectAll"
                      @change.prevent="onSelectAll"
                    />
                  </template>
                  <template #item-name>
                    <p>{{ `${$t(selectedAllText)}` }}</p>
                  </template>
                </ItemContent>
              </li>
            </ul>
          </template>
          <template v-else>
            <p>{{ $t('label.no_records_found') }}</p>
          </template>
        </div>
        <ul>
          <li
            v-for="item in filteredItems"
            :key="item.value"
            class="ms-items"
            @click.prevent="onClickCheck(item.value)"
          >
            <ItemContent>
              <template #item-check>
                <b-form-checkbox
                  :ref="`cbx-${item.value}`"
                  :value="item.value"
                  v-model="selected"
                />
              </template>
              <template #item-name>
                <p>{{ item.text }}</p>
              </template>
            </ItemContent>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import IconBase from '../../IconBase.vue'
import IconChevron from '../../icons/IconChevron'
import ItemContent from './item'

export default {
  model: {
    prop: 'items_selected',
    event: 'change'
  },
  watch: {
    selected(newVal) {
      this.$emit('change', newVal)
    },
    isSelectedAll(newVal) {
      this.groups_selectAll = newVal ? 'selectAll' : 'unSelectAll'
    },
    items(newVal) {
      const newsel = []
      this.selected.forEach((sel) => {
        const ind = newVal.findIndex((item) => item.value === sel)
        if (ind > -1) {
          newsel.push(sel)
        }
      })
      this.selected = [...newsel]
    },
    cleanSelected(newVal) {
      if (newVal) {
        this.selected = []
        this.$emit('cleaned')
      }
    }
  },
  props: {
    items_selected: Array,
    items: Array,
    placeholder: String,
    cleanSelected: Boolean
  },
  data() {
    return {
      icon_color: '#495057',
      selectIsOpen: false,
      selected: this.items_selected,
      groups_selectAll: false,
      search_string: '',
      ucode: ''
    }
  },
  components: {
    IconBase,
    IconChevron,
    ItemContent
  },
  created() {
    this.ucode = this.getUcode()
  },
  methods: {
    onOpenMultiselect() {
      const gSelected = this.selected
      if (!this.selectIsOpen) {
        this.items.sort(function(a, b) {
          const aSelected = gSelected.includes(a.value)
          const bSelected = gSelected.includes(b.value)
          if (aSelected == bSelected) {
            return a.text < b.text ? -1 : a.text > b.text ? 1 : 0
          } else {
            return aSelected > bSelected ? -1 : 1
          }
        })
      }
      this.selectIsOpen = !this.selectIsOpen
      this.$emit('onListState', this.selectIsOpen ? 'opened' : 'closed')
    },
    onHideList() {
      this.selectIsOpen = false
      this.search_string = ''
    },
    onSelectAll(e) {
      const selected = this.filteredItems.map((item) => item.value)
      if (e === 'selectAll') {
        const unicSelected = selected.filter(
          (item) => !this.selected.includes(item)
        )
        this.selected = [...this.selected, ...unicSelected]
      } else {
        const updatedArr = this.selected.filter(
          (group) => !selected.includes(group)
        )
        this.selected = [...updatedArr]
      }
    },
    getUcode() {
      return Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 10)
    },
    onClearSearch() {
      this.search_string = ''
    },
    onClickCheck(e) {
      const val = e
      if (!this.selected.includes(val)) {
        this.selected.push(val)
      } else {
        this.selected.splice(this.selected.indexOf(val), 1)
      }
    }
  },
  computed: {
    selectedList() {
      const aSelected = []
      return this.selectedText.length > 4
        ? `${this.selectedText.slice(0, 3).join(', ')} <span>+ ${this
            .selectedText.length - 3} more ... </span>`
        : this.selectedText.join(', ')
    },
    isSelectedAll() {
      return this.filteredItems.length === this.filteredItemsSelected.length
    },
    selectedAllText() {
      return !this.isSelectedAll ? 'label.select_all' : 'label.deselect_all'
    },
    filteredItems() {
      let re = new RegExp(`${this.search_string}`, 'i')
      return this.items.length > 0
        ? this.items.filter((item) => item.text.match(re))
        : []
    },
    filteredItemsSelected() {
      return this.filteredItems.filter((item) =>
        this.selected.includes(item.value)
      )
    },
    selectedText() {
      const tempSelected = []

      this.selected.forEach((elem) => {
        const found = this.items.find((item) => item.value === elem)
        if (found) {
          tempSelected.push(found.text)
        }
      })
      return tempSelected
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/styles';
.multiselect {
  position: relative;
  .multiselect-tablo {
    display: flex;
    //margin: 10px 0;
    padding-left: 5px;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    cursor: pointer;
    .ms-dd-icon {
      float: right;
      pointer-events: none;
    }
    p {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 0;
      span {
        float: right;
        opacity: 0.7;
      }
    }
  }
  .multiselect-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 0px;
    background: $white;
    position: absolute;
    transition: max-height 0.15s ease-out;
    list-style-type: none;
    z-index: 10;
    .multiselect-search {
      display: flex;
      align-items: center;
      input {
        margin-top: 0px;
        width: 95%;
        border: none;
      }
      span {
        margin-left: auto;
        cursor: pointer;
      }
    }
    ul {
      overflow-y: auto;
      padding-left: 0;
      margin-bottom: 0;
      max-height: 200px;
    }
  }
  .multiselect-check-all {
    ul {
      width: 100%;
    }
    p {
      text-align: center;
      margin-bottom: 0.3rem;
    }
  }
  .multiselect-list-open {
    max-height: 500px;
    transition: max-height 0.5s ease-in;
  }
}
.rotating {
  transition: transform 0.3s ease-in-out;
}
.rotating-opened {
  transform: rotateZ(180deg);
}

.ms-items {
  display: flex;
  min-height: calc(1.5em + 0.75rem + 2px);
  border-bottom: 1px solid #ced4da;
  padding: 5px 10px;
  cursor: pointer;
}

.elem-borders {
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}
</style>
