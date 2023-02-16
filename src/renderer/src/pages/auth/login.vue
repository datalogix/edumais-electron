<script setup lang="ts">
const router = useRouter()
const auth = useAuth()
const { loading, success, error, exec } = auth.login()

const form = reactive({
  email: null,
  password: null
})

const onLogin = async () => {
  await exec(form)

  if (success.value) {
    router.push({ name: 'dashboard' })
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-center">
      Acesse sua conta
    </h1>
    <form method="post" @submit.prevent="onLogin">
      <FormField
        v-model="form.email"
        label="E-mail"
        name="email"
        :errors="error?.errors"
      />

      <FormField
        label="Senha"
        name="password"
        :errors="error?.errors"
      >
        <template #default="{ props: { name } }">
          <PPassword
            :id="name"
            v-model="form.password"
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
        :loading="loading"
      />
    </form>
  </div>
</template>
