<script lang="ts" setup>

import { useCardStore } from '@/stores/cards'
import Dialog from '@/components/Interface/Dialog.vue'

const dialog = ref<any>(null)
const dialogMessage = ref('')
const isLoader = ref(false)

const valid = ref(false)

const form: Ref<null | HTMLFormElement > = ref(null)

const message = ref('fdsfsdfds fsdfds fdsfsd')
const messageRules = reactive([
  (value: string) => {
    if (value) return true

    return 'message is required.'
  },
  (value: string) => {
    if (value.length >= 21) return true

    return 'message must be more than 20  characters.'
  },
])

const pictureInput: Ref<null | HTMLInputElement > = ref(null)

const cardsStore = useCardStore()

const create = async(e: Promise<{}>) => {
  await e

  if (!valid.value)
    return

  try {
    isLoader.value = true
    if (pictureInput.value?.files && form.value) {
      const picture = pictureInput.value.files[0]
      await cardsStore.createCard(message.value, picture)

      form.value.reset()

      dialogMessage.value = 'card successfully added'
      dialog.value.dialogVisible = true
    }
    else {
      await cardsStore.createCard(message.value)
    }
  }
  catch (e: any) {
    if (dialog.value) {
      dialogMessage.value = e.message
      dialog.value.dialogVisible = true
    }
    console.warn(e)
  }
  finally {
    isLoader.value = false
  }
}

</script>

<template>
  <VForm
    ref="form"
    v-model="valid"
    fast-fail
    @submit.prevent="create"
  >
    <Dialog ref="dialog" :message="dialogMessage" />
    <div v-if="isLoader" class="spinner-container">
      <VProgressCircular indeterminate :size="63" />
    </div>

    <VContainer class="flex justify-center">
      <VCard width="500" class="p-30px">
        <VRow>
          <VTextarea
            v-model="message"
            :rules="messageRules"
            label="message *"
            required
            rows="8"
            variant="filled"
          />
        </VRow>
        <VRow>
          <VFileInput
            ref="pictureInput"
            display="block"
            accept="image/png, image/jpeg, image/bmp"
            label="Picture"
          />
        </VRow>

        <VRow>
          <VBtn
            type="submit"
            class="mt-2"
          >
            Add Card
          </VBtn>
          <VBtn
            to="/home"
            class="mt-2"
          >
            Go To Cards
          </VBtn>
        </VRow>
      </VCard>
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
