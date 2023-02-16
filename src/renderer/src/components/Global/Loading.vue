<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <div class="flex items-center justify-center space-x-2">
    <IconMdiLoading
      class="animate-spin w-10 h-10"
      v-bind="$attrs"
    />
    <span><slot /></span>
  </div>
</template>
