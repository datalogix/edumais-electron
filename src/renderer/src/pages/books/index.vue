<script setup lang="ts">
const { data: books } = await useApi('books').json()
</script>

<template>
  <BookList
    :books="books"
    @select="({ id }) => $router.push({ name: 'book', params: { book: id }})"
  />
</template>
