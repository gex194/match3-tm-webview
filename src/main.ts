import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { VueTelegramPlugin } from 'vue-tg'

const app = createApp(App)
// creating pinia store manager
app.use(createPinia())
// adding router to the app
app.use(router)
// adding telegram plugin to the app
app.use(VueTelegramPlugin)

app.mount('#app')
