<template>
  <div v-if="node && node.visible" class="menu-item">
    <div class="menu-item-name" @click="menuHandleClick(node, myKey)">
      <span v-if="node.caption" class="caption">{{ $t(node.caption) }}</span>
      <div
        v-if="node.isSection"
        class="triangle-bottom"
        :class="{triangleActive: node.isOpen}"
      ></div>
      <div v-if="myKey === userMenuActiveItem" class="triangleSelected" />
    </div>
    <div v-if="node.subItems && node.isOpen">
      <node
        v-for="(value, key) in node.subItems"
        :node="value"
        :key="key"
        :myKey="`${myKey}/${key}`"
        :handle-click="handleClick"
      ></node>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'node',
  data() {
    return {
      showChildren: true,
      selected_item: ''
    }
  },
  props: {
    node: Object,
    myKey: String,
    handleClick: Function
  },
  mounted() {},
  methods: {
    menuHandleClick(node, myKey) {
      this.handleClick(node, myKey)
    }
  },
  computed: {
    ...mapGetters(['userMenuActiveItem'])
  }
}
</script>

<style lang="scss">
@import '@/assets/styles.scss';

.menu-item {
  font-size: 0.9em;
  display: flex;
  align-content: space-between;
  flex-direction: column;
  padding: 15px 10px 15px 2px;
  color: white;
  cursor: pointer;
  .menu-item-name {
    display: flex;
    flex-direction: row;
    .triangle-bottom {
      width: 10px;
      margin-left: auto;
      &:before {
        position: relative;
        right: 0;
        top: 65%;
        color: #999;
        margin-top: 4px;
        border-style: solid;
        border-width: 5px 5px 0;
        border-color: #999 transparent transparent;
        content: '';
      }
    }
  }
  .triangleActive {
    transform: rotate(180deg);
  }
  .triangleSelected {
    transform: rotate(90deg);
    left: 139px;
    position: absolute;
    &:before {
      position: relative;
      right: 0;
      top: 0px;
      color: #999;
      margin-top: 4px;
      border-style: solid;
      border-width: 15px 15px 0;
      border-color: $gray-lightest transparent transparent;
      content: '';
    }
  }
  .sub-menu-item {
    display: flex;
  }
}
.last {
  border-bottom: 0px;
}
</style>
>
