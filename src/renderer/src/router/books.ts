import Books from '@renderer/pages/books/index.vue'
import Book from '@renderer/pages/books/show.vue'
import BookLayout from '@renderer/layouts/Empty.vue'

export default [
  {
    path: '/books',
    name: 'books',
    component: Books
  },

  {
    path: '/books/:book',
    name: 'book',
    component: Book,
    meta: {
      layout: BookLayout
    }
  }
]
