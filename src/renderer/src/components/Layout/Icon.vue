<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <router-link :to="{ name: 'dashboard' }">
    <img
      class="mx-auto max-h-10"
      src="@renderer/assets/imgs/icon.png"
      v-bind="$attrs"
    />
  </router-link>
</template>
