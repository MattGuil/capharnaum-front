import './style.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify.js'
import router from "./router/router.js"

createApp(App).use(vuetify).use(router).mount('#app')
