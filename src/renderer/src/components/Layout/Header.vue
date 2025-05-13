<script lang="ts" setup>
const { user } = useAuth()
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
        v-if="user"
        type="button"
        class="p-button-text p-button-secondary !py-2 !px-3"
        @click="(e) => userMenu.toggle(e)"
      >
        <PAvatar
          :icon="user.avatar_url ? undefined : 'pi pi-user'"
          :image="user.avatar_url ? user.avatar_url : undefined"
          shape="circle"
        />
      </PButton>
      <PMenu
        ref="userMenu"
        :popup="true"
        :model="[{ label: 'Sair', icon: 'pi pi-power-off', to: { name: 'logout' } }]"
      />
    </div>
  </div>
</template>
