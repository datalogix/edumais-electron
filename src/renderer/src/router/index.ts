import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuth } from '@renderer/composables/useAuth'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuth()
  const requiresAuth = to.meta.requiresAuth ?? true

  if (requiresAuth && !auth.isLoggedIn) {
    return {
      name: 'login'
    }
  }

  return
})

export default router
