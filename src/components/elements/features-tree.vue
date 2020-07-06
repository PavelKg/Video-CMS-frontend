<template>
  <div>
    <li>
      <div class="li-title">
        <span
          class="group-arrow"
          :class="{disabled: !checked || isCheckboxDisabled}"
          v-if="isFolder"
          v-html="isOpen ? '&#x25BE;' : '&#x25B8;'"
          @click="toggle"
        ></span>
        <span v-else v-html="'&#x25B5;'" class="disabled"></span>
        <b-form-checkbox
          :name="item.name"
          :checked="checked"
          @change="onChange"
          :disabled="isCheckboxDisabled"
        >
          {{ $t(`permits.${path}.name`) }}
        </b-form-checkbox>
      </div>
      <ul v-show="isOpen" v-if="isFolder">
        <tree-item
          class="item"
          v-for="(child, index) in item.children"
          @onChangeState="onChangeState"
          :key="`${index}.${permits ? permits.toString() : index}`"
          :path="`${path}.${child.name}`"
          :item="child"
          :permits="
            permits && permits.children
              ? permits.children.find((el) => el.name === child.name)
              : null
          "
          :selected="
            permits &&
            permits.children &&
            permits.children.find((el) => el.name === child.name)
              ? true
              : false
          "
          :isAdminOptEnable="isAdminOptEnable"
        ></tree-item>
      </ul>
    </li>
  </div>
</template>
<script>
export default {
  name: 'treeItem',
  props: {
    item: Object,
    permits: Object,
    selected: Boolean,
    path: String,
    isAdminOptEnable: Boolean
  },
  data: function() {
    return {
      isOpen: false
      //checked: this.selected
    }
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length
    },
    checked() {
      return this.selected
    },
    isCheckboxDisabled() {
      return !this.isAlwaysEnabled(this.item.name) && !this.isAdminOptEnable
    }
  },
  methods: {
    toggle() {
      if (this.checked) {
        this.isOpen = !this.isOpen
      }
    },
    onChangeState(payload) {
      this.$emit('onChangeState', payload)
    },
    onChange(state) {
      this.onChangeState({target: this.path, selected: state})
    },
    isAlwaysEnabled(name) {
      const alwaysCheckedList = ['videos', 'messages', 'settings', 'player']
      return alwaysCheckedList.includes(name)
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/styles';
.hide {
  visibility: hidden;
}
.disabled {
  opacity: 0.2;
}
.li-title {
  display: flex;
  span {
    cursor: pointer;
    padding-right: 0.5rem;
    color: var(--secondary);
  }
}
ul {
  list-style-type: none;
}
</style>
