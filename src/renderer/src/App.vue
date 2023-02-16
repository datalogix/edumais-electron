<script setup lang="ts">
import LayoutDefault from './layouts/Default.vue'
</script>

<template>
  <Component :is="$route.meta?.layout || LayoutDefault">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Transition mode="out-in">
          <Suspense>
            <template #default>
              <Component :is="Component" />
            </template>

            <template #fallback>
              <Loading />
            </template>
          </Suspense>
        </Transition>
      </template>
    </RouterView>
  </Component>
</template>
