import { initializeApp } from 'firebase/app'
// import { getStorage } from 'firebase/storage'

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyCMjGDT2dQLVoyytrjylwEcjuRvjU7dIdA',
  authDomain: 'project-3161223530572492402.firebaseapp.com',
  databaseURL: 'https://project-3161223530572492402-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'project-3161223530572492402',
  storageBucket: 'project-3161223530572492402.appspot.com',
  messagingSenderId: '333301282983',
  appId: '1:333301282983:web:361389a0b83f2a78158382',
  measurementId: 'G-ETFS32FQV5',
})

// Initialize Cloud Storage and get a reference to the service
// const storage = getStorage(firebaseApp)
