import { Nullable } from 'primevue/ts-helpers'

export const useAuth = () => {
  const tokenState = useLocalStorage('token', null)
  const userState = useLocalStorage('user', null, {
    serializer: {
      read: (v: any) => v ? JSON.parse(v) : null,
      write: (v: any) => JSON.stringify(v),
    }
  })

  return {
    get token () {
      return unref(tokenState)
    },

    get user () {
      return unref(userState)
    },

    get isLoggedIn () {
      return isDefined(this.user) && isDefined(this.token)
    },

    login(fields: Record<string, Nullable<string>> = { email: null, password: null }) {
      const router = useRouter()
      const form = useForm('/auth/login', fields)

      form.onFetchResponse(() => {
        const { user, token } = unref(form.data)

        userState.value = user
        tokenState.value = token
      })

      form.onFetchFinally(async () => {
        if (unref(form.response)?.ok) {
          await router.push({ name: 'dashboard' })
        }
      })

      return form
    },

    async logout() {
      const router = useRouter()

      await useApi('/auth/logout', {
        method: 'POST'
      })

      userState.value = null
      tokenState.value = null

      await router.push({ name: 'login' })
    },
  }
}
