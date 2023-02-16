<script lang="ts" setup>
const auth = useAuth()
const userMenu = ref()
</script>

<template>
  <div class="w-full flex items-center justify-between p-2 bg-white shadow space-x-20">
    <div>
      <LayoutIcon />
    </div>
    <div>
      <PButton
        class="p-button-secondary p-button-text !py-2 !px-3"
        icon="pi pi-book"
        label="Livros"
      />
    </div>
    <div>
      <PButton
        type="button"
        class="p-button-text p-button-secondary !py-2 !px-3"
        @click="(e) => userMenu.toggle(e)"
      >
        <PAvatar
          :icon="auth.user.avatar_url ? undefined : 'pi pi-user'"
          :image="auth.user.avatar_url ? auth.user.avatar_url : undefined"
          shape="circle"
        />
      </PButton>
      <PMenu
        ref="userMenu"
        :popup="true"
        :model="[
          { label: 'Sair', icon: 'pi pi-power-off', to: { name: 'logout' } }
        ]"
      />
    </div>
  </div>
</template>
