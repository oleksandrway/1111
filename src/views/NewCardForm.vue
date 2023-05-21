<script lang="ts" setup>
// import Compressor from 'compressorjs' // unistall

import { useCardStore } from '@/stores/cards'
import Dialog from '@/components/Interface/Dialog.vue'

const router = useRouter()

const dialog = ref<any>(null)
const errorMessage = ref('')
const isLoader = ref(false)

const valid = ref(false)
const message = ref('fdsfsdfds')
const messageRules = reactive([
  (value: string) => {
    if (value) return true

    return 'message is required.'
  },
  (value: string) => {
    if (value.length >= 8) return true

    return 'message must be more than 7  characters.'
  },
])

const pictureInput: Ref<null | HTMLInputElement > = ref(null)

const PictureRules = reactive([
  (value: any) => {
    if (!value.length) {
      return 'picture is required'
    }

    return true
  },
])

const cardsStore = useCardStore()

const create = async(e: Promise<{}>) => {
  await e

  if (!valid.value)
    return

  if (pictureInput.value?.files) {
    try {
      isLoader.value = true
      const picture = pictureInput.value.files[0]
      await cardsStore.createCard(message.value, picture)
      router.replace('/')
    }
    catch (e: any) {
      if (dialog.value) {
        errorMessage.value = e.message
        dialog.value.dialogVisible = true
      }
      console.warn(e)
    }
    finally {
      isLoader.value = false
      console.log(1)
    }
  }
}

</script>

<template>
  <VForm
    v-model="valid"
    fast-fail
    @submit.prevent="create"
  >
    <Dialog ref="dialog" :message="errorMessage" />
    <div v-if="isLoader" class="spinner-container">
      <VProgressCircular indeterminate :size="63" />
    </div>

    <VContainer>
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="message"
            :rules="messageRules"
            label="message"
            required
          />
        </VCol>
        <VCol
          cols="12"
          md="4"
        >
          <VFileInput
            ref="pictureInput"
            :rules="PictureRules"
            accept="image/png, image/jpeg, image/bmp"
            prepend-icon="mdi-camera"
            label="Picture"
          />
        </VCol>
        <VCol>
          <VBtn
            type="submit"
            block
            class="mt-2"
          >
            add card
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>

<style lang="scss" scoped>
.spinner-container {

  z-index: 2;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,.5);
}
</style>
