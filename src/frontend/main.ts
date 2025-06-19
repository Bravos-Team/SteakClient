// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/index.css'
const app = createApp(App);
const pinia = createPinia();
app.use(pinia); // Phải trước router
app.use(router);
app.mount('#app');