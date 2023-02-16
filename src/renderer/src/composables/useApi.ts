import { createFetch } from '@vueuse/core'

export const useApi = createFetch({
  baseUrl: 'http://edumais.test/api/',
  options: {
    async beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }

      return { options }
    }
  }
})
