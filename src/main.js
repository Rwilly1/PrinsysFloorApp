import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import FloorMap from './views/FloorMap.vue'

const routes = [
  { path: '/', redirect: '/floor-map' },
  { path: '/floor-map', component: FloorMap },
  { path: '/access-leak', component: FloorMap },
  { path: '/profile', component: FloorMap }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
