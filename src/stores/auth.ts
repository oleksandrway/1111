import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// let timer

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const userId: Ref<string| null> = useStorage('userId', null)
  const token: Ref<string| null> = useStorage('userToken', null)
  const didAutoLogout = ref(false)
  const expirationTime: Ref<null| number> = ref(null)
  const timer: Ref<ReturnType<typeof setTimeout> | null> = ref(null)

  const logOut = () => {
    userId.value = null
    token.value = null

    clearTimeout(timer.value)
    router.replace('/auth')
  }

  const setLogOutTimeout = () => {
    if (expirationTime.value !== null) {
      const expirationIn = expirationTime.value - new Date().getTime()
      // console.log(expirationTime.value)
      // console.log(new Date().getTime())
      // console.log(expirationIn)
      timer.value = setTimeout(() => {
        logOut()
      }, 15000)
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
    // responseData.expiresIn = 'fjdsf'

    expirationTime.value = new Date().getTime() + +responseData.expiresIn * 1000

    setLogOutTimeout()
  }

  return { userId, token, didAutoLogout, auth, logOut, setLogOutTimeout }
})
