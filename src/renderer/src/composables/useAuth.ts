export const useAuth = () => {
  return {
    get user () {
      try {
        return JSON.parse(String(window.localStorage.getItem('user')))
      } catch {
        return null
      }
    },

    get token () {
      return window.localStorage.getItem('token')
    },

    get isLoggedIn () {
      return this.user !== null
    },

    login () {
      const loading = ref(false)
      const error = ref<{ errors?: Array<string> }>({})
      const success = ref(false)

      const exec = async ({ email, password }) => {
        loading.value = true
        error.value = {}
        success.value = false

        const response = await fetch('http://edumais.test/api/auth/login', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email,
            password
          })
        })

        loading.value = false

        const data = await response.json()

        if (!response.ok) {
          error.value = data
          return
        }

        window.localStorage.setItem('user', JSON.stringify(data.user))
        window.localStorage.setItem('token', data.token)

        success.value = true

        return data
      }

      return {
        loading,
        error,
        success,
        exec
      }
    },

    async logout() {
      await fetch('http://edumais.test/api/auth/logout', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        }
      })

      window.localStorage.removeItem('user')
      window.localStorage.removeItem('token')
    },
  }
}
