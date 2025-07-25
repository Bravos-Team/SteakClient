import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/library' },
      {
        path: 'library',
        component: () => import('@/views/library/Library.vue'),
      },
      {
        path: 'library/:id',
        component: () => import('@/views/library/GameDetail.vue'),
        props: true,
      },
      { path: 'store', component: () => import('@/views/Store.vue') },
      { path: 'download', component: () => import('@/layout/download/DownloadLayout.vue') },
      { path: 'account', component: () => import('@/views/Account.vue') },
      { path: 'test', component: () => import('@/views/library/GameDetail.vue') },
      { path: ':pathMatch(.*)*', component: () => import('@/views/NotFound.vue') },
    ],
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
