<script setup lang="ts">
const props = defineProps(['book'])
const cover = await useCache(props.book.cover, props.book.cover_url)
</script>

<template>
  <div
    class="h-full p-6 space-y-4 text-center transition bg-white rounded-lg shadow w-80 hover:scale-105"
  >
    <UseImage v-if="cover" class="mx-auto max-h-72" :src="cover">
      <template #loading>
        <PSkeleton width="100%" height="18rem" />
      </template>

      <template #error>
        <IconPhBookThin width="100%" height="18rem" />
      </template>
    </UseImage>

    <IconPhBookThin v-else width="100%" height="18rem" />

    <div>{{ book.name }}</div>
  </div>
</template>
