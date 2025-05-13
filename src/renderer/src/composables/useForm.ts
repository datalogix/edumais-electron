import { MaybeComputedRef, UseFetchOptions } from '@vueuse/core'
import { Nullable } from 'primevue/ts-helpers'

export const useForm = (
  url: MaybeComputedRef<string>,
  fields: Record<string, Nullable<string>>,
  options:RequestInit = {},
  useFetchOptions: UseFetchOptions = {}
) => {
  const form = reactive(fields)
  const api = useApi(url, options, { immediate: false, ...useFetchOptions })
    .post(form)
    .json()

  return Object.assign(form, api)
}
