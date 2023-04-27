<script lang="ts">
import { useCardStore } from '@/stores/cards'

export default {
  setup() {
    const router = useRouter()
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
      (value: File) => {
        if (value.length) {
          return true
        }
        return 'picture is required'
      },
    ])

    const cardsStore = useCardStore()

    const create = async(e: Promise<{}>) => {
      await e

      if (!valid.value)
        return

      if (pictureInput.value?.files) {
        try {
          await cardsStore.createCard(message.value, pictureInput.value.files[0])
        }
        catch (e) {
          console.warn(e)
        }
      }
    }

    return {
      valid,
      message,
      messageRules,
      pictureInput,
      PictureRules,
      create,

    }
  },
}
</script>

<template>
  <VForm
    v-model="valid"
    fast-fail
    @submit.prevent="create"
  >
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
            add candy
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>
