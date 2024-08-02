import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { useStyleStore } from '@/stores/style.js'
import { darkModeKey, styleKey } from '@/config.js'
import { useAuthStore } from '@/stores/auth.ts'
import authentication from './plugins/authentication'

import './css/main.css'

const app = createApp(App)

// Create Pinia
const pinia = createPinia()
app.use(pinia) // Install Pinia

// Get stores
const authStore = useAuthStore()
const styleStore = useStyleStore()

// Check if the access token exists in local storage
const accessToken = localStorage.getItem('accessToken')
if (accessToken) {
  // Set the access token in the auth store
  authStore.setAccessToken(accessToken)
}

// Wait for the initialize action to complete before mounting the app
authStore.initialize().then(() => {
  // App style
  styleStore.setStyle(localStorage[styleKey] ?? 'basic')

  // Dark mode
  if (
    (!localStorage[darkModeKey] && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
    localStorage[darkModeKey] === '1'
  ) {
    styleStore.setDarkMode(true)
  }

  // Default title tag
  const defaultDocumentTitle = 'PM-Project'

  // Set title tag
  router.afterEach((to) => {
    document.title = to.meta.title || defaultDocumentTitle
  })

  // Mount the app
  app.use(router).use(authentication).mount('#app')
})
