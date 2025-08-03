// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import './assets/index.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
// eslint-disable-next-line import/no-named-as-default
import router from './router'
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
// app.use(VueApexCharts)
app.use(router)
app.use(VueQueryPlugin)
app.mount('#app')
