import { createRouter, createWebHistory } from 'vue-router';


const routes = [
  {
    path: '/dashboard',
    component: () => import('../views/DashBoard.vue'),
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;