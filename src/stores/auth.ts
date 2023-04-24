import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// let timer

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const userId: Ref<string| null> = useStorage('userId', null)
  const token: Ref<string| null> = useStorage('token', null)
  // const didAutoLogout = ref(false)
  const expirationTime: Ref<null| number> = useStorage('expirationTime', null)
  const timer: Ref<ReturnType<typeof setTimeout> | string | number | undefined | null> = ref(null)

  const logOut = () => {
    userId.value = null
    token.value = null
    expirationTime.value = null

    if (timer.value) {
      clearTimeout(timer.value)
    }

    router.replace('/auth')
  }

  const setLogOutTimeout = () => {
    if (expirationTime.value !== null) {
      const expirationIn = expirationTime.value - new Date().getTime()
      if (expirationIn > 0) {
        timer.value = setTimeout(() => {
          logOut()
        }, expirationIn)
      }
      else {
        logOut()
      }
    }
  }

  const auth = async(email: string, password: string, mode: string) => {
    console.log(email, password, mode)

    const API_KEY = 'AIzaSyCMjGDT2dQLVoyytrjylwEcjuRvjU7dIdA'
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`

    const url = (mode === 'logIn') ? signInUrl : signUpUrl

    // console.log(url)
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      headers: {
        'Content-Type': 'application/json',
      },

    },
    )
    const responseData: { localId: string; idToken: string; expiresIn: string } = await response.json()
    console.log(responseData)
    userId.value = responseData.localId
    token.value = responseData.idToken
    expirationTime.value = new Date().getTime() + +responseData.expiresIn * 1000
    // expirationTime.value = new Date().getTime() + 5000

    setLogOutTimeout()
  }

  return {
    userId,
    token,
    // didAutoLogout,
    auth,
    logOut,
    setLogOutTimeout,
  }
})
