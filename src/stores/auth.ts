import { defineStore } from 'pinia'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'

import { useCurrentUser, useFirebaseAuth } from 'vuefire'

import type { Mode } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const firebaseAuth = useFirebaseAuth()
  const user = useCurrentUser()
  const router = useRouter()

  const auth = async(email: string, password: string, mode: Mode) => {
    if (!firebaseAuth)
      return

    if (mode === 'logIn') {
      signInWithEmailAndPassword(firebaseAuth, email, password)
        .then(() => {
          router.replace('/')
        })
    }
    if (mode === 'signUp') {
      createUserWithEmailAndPassword(firebaseAuth, email, password)
        .then(() => {
          router.replace('/')
        })
    }
  }

  const logOut = async() => {
    if (!firebaseAuth)
      return

    return signOut(firebaseAuth)
      .then(() => {
        router.replace('/auth')
      })
  }

  return {
    firebaseAuth,
    auth,
    logOut,
    user,
  }
})
