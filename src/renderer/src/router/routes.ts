import type { RouteRecordRaw } from 'vue-router'
import auth from './auth'
import books from './books'

export default [
  ...auth,
  ...books,

  {
    path: '/',
    name: 'dashboard',
    redirect: {
      name: 'books'
    }
  }
] as Readonly<RouteRecordRaw[]>
