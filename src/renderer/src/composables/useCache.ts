import { set, get } from 'idb-keyval'

export const useCache = async (path: string, defaultValue = null) => {
  const online = useOnline()
  const result = ref<string | null>(defaultValue)

  if (!path) {
    return Promise.resolve(result)
  }

  const cache = await get(path)

  if (cache && cache !== 'loading') {
    result.value = URL.createObjectURL(cache)

    return Promise.resolve(result)
  }

  if (online.value && cache === undefined) {
    await set(path, 'loading')

    queue.add(() => {
      return useApi(`/download?path=${path}`)
        .blob()
        .then(({ isFinished, error, data }) => {
          return isFinished.value && data.value && !error.value
            ? set(path, unref(data))
            : Promise.resolve()
        })
    }, { priority: 0 })
  }

  return Promise.resolve(result)
}
