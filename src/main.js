import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify.js'
import router from "./router/router.js"

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

createApp(App).use(vuetify).use(router).mount('#app')
