import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'

import { VueFire, VueFireAuth } from 'vuefire'

import { firebaseApp } from './firebase'

import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import 'virtual:windi.css'
import './scss/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],

})
app.use(createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
  defaults: {
    VBtn: {
      variant: 'flat',
    },
  },
}))

app.mount('#app')
