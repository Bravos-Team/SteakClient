// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import router from './router'
import './assets/index.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // Phải trước router
app.use(VueApexCharts)
app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
