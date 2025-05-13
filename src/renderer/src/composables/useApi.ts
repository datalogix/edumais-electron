import { createFetch } from '@vueuse/core'

export const useApi = createFetch({
  baseUrl: import.meta.env.RENDERER_VITE_API_ENDPOINT,
  options: {
    async beforeFetch({ options }) {
      const { token } = useAuth()

      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }

      return {
        options
      }
    }
  }
})

export const useApiCache = async (url: string) => {
  const online = useOnline()
  const state = useLocalStorage(url, null, {
    serializer: {
      read: (v: any) => v ? JSON.parse(v) : null,
      write: (v: any) => JSON.stringify(v),
    }
  })

  const load = () => {
    return useApi(url)
      .json()
      .then((response) => {
        if (!response.error.value && response.isFinished.value && response.data.value) {
          state.value = Object.assign({}, response)
        }

        return response
      })
  }

  if (online.value) {
    await load()
  }

  return Promise.resolve(state.value)
}
