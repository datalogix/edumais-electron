<template>
  <LayoutBackground class="grid content-center">
    <header class="py-6">
      <slot name="header">
        <LayoutLogo />
      </slot>
    </header>
    <main class="w-full max-w-lg px-10 py-6 mx-auto">
      <Box>
        <slot />
      </Box>
    </main>
    <footer>
      <slot name="footer">
        <LayoutFooter />
      </slot>
    </footer>
  </LayoutBackground>
</template>
