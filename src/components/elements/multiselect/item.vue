<template>
  <div class="multiselect-item-content">
    <slot name="item-check"></slot>
    <slot name="item-name"></slot>
  </div>
</template>
<script>
export default {}
</script>

<style lang="scss">
.multiselect-item-content {
  width: 100%;
  display: flex;
  align-items: center;
  p {
    margin: 0.3rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
