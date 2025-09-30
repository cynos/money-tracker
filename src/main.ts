import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { piniaInitPlugin } from './composables/piniaInitPlugin'
import '@/assets/styles.css'
import 'v-calendar/style.css'
import { setupCalendar } from 'v-calendar'

// Use plugin with optional defaults
const app = createApp(App)

// pinia
const pinia = createPinia()
pinia.use(piniaInitPlugin)
app.use(pinia)

// calendar plugin
app.use(setupCalendar, {})

// router
app.use(router)

// mounting
app.mount('#app')
