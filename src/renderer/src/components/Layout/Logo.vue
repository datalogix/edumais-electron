<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<template>
  <router-link :to="{ name: 'dashboard' }">
    <img
      class="mx-auto max-h-40"
      src="@renderer/assets/imgs/logo.png"
      v-bind="$attrs"
    />
  </router-link>
</template>
