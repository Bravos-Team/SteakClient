import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/library',
    name: 'Library',
    component: () => import('@/views/library/Library.vue'),
    meta: { title: 'Library' },
  },
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/Store.vue'),
    meta: { title: 'Store' },
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import('@/views/Download.vue'),
    meta: { title: 'Download' },
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/Account.vue'),
    meta: { title: 'Account' },
  },

  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/test.vue'),
    meta: { title: 'Test Page' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404 Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  console.log('Router navigating to:', to.path)
  // Set the document title based on the route meta title
  if (to.meta.title) {
    document.title = to.meta.title as string
  } else {
    document.title = 'Steak Client' // Default title if no meta title is set
  }
  // Continue to the next middleware or route
  next()
})
export default router
