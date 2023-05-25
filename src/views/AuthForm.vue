<script lang="ts" setup>
import type { SubmitEventPromise } from 'vuetify'

import { useAuthStore } from '@/stores/auth'
import type { Mode } from '@/types'
import Dialog from '@/components/Interface/Dialog.vue'

const dialog = ref<any>(null)
const errorMessage = ref('')

const valid = ref(false)
const email = ref('dfshgfdg@co.com')
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
const password = ref('somepasswaord1221334')
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

const mode = ref<Mode>('logIn')
const authStore = useAuthStore()

const submitButtonCaption = computed(() => {
  if (mode.value === 'logIn') return 'Login'
  return 'Signup'
})
const onChangeModeButtonCaption = computed(() => {
  if (mode.value === 'logIn') return 'Signup instead'
  return 'Login instead'
})

const onChangeMode = () => {
  if (mode.value === 'logIn') mode.value = 'signUp'
  else mode.value = 'logIn'
}

const onAuth = async(e: SubmitEventPromise) => {
  const result = await e
  if (result.valid) {
    try {
      await authStore.auth(email.value, password.value, mode.value)
    }
    catch (e: any) {
      if (dialog.value) {
        errorMessage.value = e.message
        dialog.value.dialogVisible = true
      }
    }
  }
}

</script>

<template>
  <VForm
    v-model="valid"
    fast-fail
    @submit.prevent="onAuth"
  >
    <Dialog ref="dialog" :message="errorMessage" />
    <VContainer class="flex justify-center">
      <VCard width="500" class="p-30px">
        <VRow>
          <VTextField
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          />
        </VRow>
        <VRow>
          <VTextField
            v-model="password"
            :rules="passwordRules"
            label="password"
            required
          />
        </VRow>
        <VRow>
          <VBtn
            type="submit"
            class="mt-2"
          >
            {{ submitButtonCaption }}
          </VBtn>

          <VBtn
            class="mt-2"
            @click="onChangeMode"
          >
            {{ onChangeModeButtonCaption }}
          </VBtn>
        </VRow>
      </VCard>
    </VContainer>
  </VForm>
</template>
