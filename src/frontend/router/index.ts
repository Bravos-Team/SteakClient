import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [
  { path: '/', component: () => import('../views/DashBoard.vue') },
];
const isElectron = window && window.process && window.process.type;

const router = createRouter({
  history:  createWebHashHistory() ,
  routes,
});
router.beforeEach((to, from, next) => {
  console.log('Router navigating to:', to.path);
  return next();
});
export default router;