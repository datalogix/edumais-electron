<template>
  <LayoutBackground>
    <header class="w-full">
      <slot name="header">
        <LayoutHeader />
      </slot>
    </header>
    <main class="flex-1 w-full px-10 py-6 mx-auto">
      <slot />
    </main>
    <footer>
      <slot name="footer">
        <LayoutFooter />
      </slot>
    </footer>
  </LayoutBackground>
</template>
