<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <Component :is="Component" />

      <template #fallback>
        <div class="min-h-screen h-full grid content-center">
          <div class="space-y-6">
            <LayoutLogo />
            <Loading />
          </div>
        </div>
      </template>
    </Suspense>
  </RouterView>
</template>
