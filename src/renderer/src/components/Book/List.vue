<script setup lang="ts">
defineProps(['books'])

const emits = defineEmits(['select'])
</script>

<template>
  <div class="flex flex-wrap gap-6 justify-center">
    <BookComponent
      v-for="book in books"
      :key="book"
      :book="book"
      @click="emits('select', book)"
    />
  </div>
</template>
