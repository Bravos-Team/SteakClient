import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/library' },
      { path: 'library', component: () => import('@/views/library/Library.vue') },
      { path: 'store', component: () => import('@/views/Store.vue') },
      { path: 'download', component: () => import('@/layout/download/DownloadLayout.vue') },
      { path: 'account', component: () => import('@/views/Account.vue') },
      { path: 'test', component: () => import('@/views/test.vue') },
      { path: ':pathMatch(.*)*', component: () => import('@/views/NotFound.vue') },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router