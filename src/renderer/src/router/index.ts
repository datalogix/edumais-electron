import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuth } from '@renderer/composables/useAuth'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const { isLoggedIn } = useAuth()
  const requiresAuth = to.meta.requiresAuth ?? true

  if (requiresAuth && !isLoggedIn) {
    return {
      name: 'login'
    }
  }

  return
})

export default router
