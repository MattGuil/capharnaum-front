import './style.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify.js'
import router from "./router/router.js"

const pinia = createPinia()

createApp(App).use(pinia).use(vuetify).use(router).mount('#app')
