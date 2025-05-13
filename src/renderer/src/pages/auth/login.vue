<script setup lang="ts">
const login = useAuth().login()
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-center">Acesse sua conta</h1>

    <form method="post" @submit.prevent="login.execute">
      <FormField
        v-model="login.email"
        label="E-mail"
        name="email"
        :errors="login.error ? login.data?.errors : {}"
      />

      <FormField label="Senha" name="password" :errors="login.error ? login.data?.errors : {}">
        <template #default="{ props: { name } }">
          <PPassword
            :id="name"
            v-model="login.password"
            :input-id="name"
            class="w-full"
            :feedback="false"
            :toggle-mask="true"
          />
        </template>
      </FormField>

      <PButton
        type="submit"
        class="w-full p-button-success"
        label="Entrar"
        :loading="login.isFetching"
      />
    </form>
  </div>
</template>
