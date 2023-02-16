<script setup lang="ts">
defineProps(['book'])
</script>

<template>
  <div
    class="cursor-pointer bg-white shadow rounded-lg p-6 block space-y-4 text-center w-[300px] h-[330px] flex flex-col justify-between transition hover:scale-105"
  >
    <div
      v-if="book.cover_url"
      class="flex-1 w-full bg-cover bg-no-repeat bg-center"
      :style="{
        backgroundImage: `url('${book.cover_url}')`
      }"
    />
    <IconPhBookThin v-else class="flex-1 w-full" />
    <div>
      {{ book.name }}
    </div>
  </div>
</template>
