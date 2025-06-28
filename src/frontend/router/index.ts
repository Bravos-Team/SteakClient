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
    component: () => import('@/views/Library.vue'),
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
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404 Not Found' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
router.beforeEach((to, from, next) => {
  console.log('Router navigating to:', to.path)
  document.title = to.meta.title || 'Default Title' // Fallback title
  next()
})
export default router
