<script lang="ts">
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const router = useRouter()
    const valid = ref(false)
    const email = ref('')
    const emailRules = reactive([
      (value: string) => {
        if (value) return true

        return 'E-mail is requred.'
      },
      (value: string) => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail must be valid.'
      },
    ])
    const password = ref('')
    const passwordRules = reactive([
      (value: string) => {
        if (value) return true

        return 'password is required.'
      },
      (value: string) => {
        if (value?.length >= 8) return true

        return 'password must be more than 7  characters.'
      },
    ])

    const mode = ref('logIn')
    const authStore = useAuthStore()

    const submitButtonCaption = computed(() => {
      if (mode.value === 'logIn') return 'Login'
      return 'Signup'
    })
    const changeModeButtonCaption = computed(() => {
      if (mode.value === 'logIn') return 'Signup instead'
      return 'Login instead'
    })

    const changeMode = () => {
      if (mode.value === 'logIn') mode.value = 'signUp'
      else mode.value = 'logIn'
    }

    const auth = async() => {
      if (valid.value) {
        try {
          await authStore.auth(email.value, password.value, mode.value)
          router.replace('/')
        }
        catch (e) {
          console.log(e)
        }
      }
    }

    return {
      mode,
      authStore,
      submitButtonCaption,
      changeModeButtonCaption,
      changeMode,
      valid,
      email,
      emailRules,
      password,
      passwordRules,
      auth,
    }
  },
  // data: () => ({
  //   // mode: 'logIn',
  //   // authStore: useAuthStore(),
  //   valid: false,
  //   email: '',
  //   emailRules: [
  //     (value: string) => {
  //       if (value) return true

  //       return 'E-mail is requred.'
  //     },
  //     (value: string) => {
  //       if (/.+@.+\..+/.test(value)) return true

  //       return 'E-mail must be valid.'
  //     },
  //   ],
  //   password: '',
  //   passwordRules: [
  //     (value: string) => {
  //       if (value) return true

  //       return 'password is required.'
  //     },
  //     (value: string) => {
  //       if (value?.length >= 8) return true

  //       return 'password must be more than 7  characters.'
  //     },
  //   ],
  // }),
  // methods: {
  //   log() {
  //     if (this.valid) {
  //       console.log(this.email, this.password)

  //       this.authStore.auth()
  //     }
  //   },
  // },
}
</script>

<template>
  <VForm
    v-model="valid"
    fast-fail
    @submit.prevent="auth"
  >
    <VContainer>
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          />
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="password"
            :rules="passwordRules"
            label="password"
            required
          />
        </VCol>
        <VCol>
          <VBtn
            type="submit"
            block
            class="mt-2"
          >
            {{ submitButtonCaption }}
          </VBtn>
        </VCol>
        <VCol>
          <VBtn
            block
            class="mt-2"
            @click="changeMode"
          >
            {{ changeModeButtonCaption }}
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>
