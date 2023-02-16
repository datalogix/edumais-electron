import Login from '@renderer/pages/auth/login.vue'
import Logout from '@renderer/pages/auth/logout.vue'
import AuthLayout from '@renderer/layouts/Auth.vue'

export default [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
      layout: AuthLayout
    }
  },

  {
    path: '/logout',
    name: 'logout',
    component: Logout,
    meta: {
      layout: AuthLayout
    }
  }
]
