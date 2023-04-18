import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
// import { getAnalytics } from "firebase/analytics";
// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'

import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import 'virtual:windi.css'
import './scss/main.scss'

// Import the functions you need from the SDKs you need

// const firebaseConfig = {
//   apiKey: 'AIzaSyCMjGDT2dQLVoyytrjylwEcjuRvjU7dIdA',
//   authDomain: 'project-3161223530572492402.firebaseapp.com',
//   projectId: 'project-3161223530572492402',
//   storageBucket: 'project-3161223530572492402.appspot.com',
//   messagingSenderId: '333301282983',
//   appId: '1:333301282983:web:361389a0b83f2a78158382',
//   measurementId: 'G-ETFS32FQV5',
// }

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig)
// const auth = getAuth(firebaseApp)

const app = createApp(App)

app.use(createPinia())
app.use(router)
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
