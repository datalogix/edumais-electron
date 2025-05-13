<script setup lang="ts">
const books = ref([])
const loading = ref(false)

const onPage = async (event): Promise<void> => {
  loading.value = true
  const response = await queue.add(() => useApiCache(`/books/?page=${event.page + 1}`), {
    priority: 3
  })

  if (response && response.data) {
    books.value = response.data
    loading.value = false
  }
}

await onPage({ page: 0 })
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="fixed w-full h-full flex justify-center items-center bg-white inset-0 bg-opacity-75"
    >
      <Loading />
    </div>

    <BookList
      :books="books.data"
      @select="({ id }) => $router.push({ name: 'book', params: { book: id } })"
    />

    <PPaginator
      class="mt-4 paginator"
      :rows="books.per_page"
      :total-records="books.total"
      :first="(books.current_page - 1) * books.per_page"
      :always-show="false"
      @page="onPage"
    >
      <template #start>
        <slot name="start">Total: {{ books.total }}</slot>
      </template>
    </PPaginator>
  </div>
</template>
