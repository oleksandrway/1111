<script setup lang="ts">
import { useStorage } from '@vueuse/core'

import { useCardStore } from '@/stores/cards'

const cardsStore = useCardStore()

const btnDisabledTill = useStorage<number | null>('btnDisabledTill', null)

const getCardIsDisabled = ref(false)
const card = ref<{ imgUrl: string; message: string; isUsed: boolean } | null>(null)
const cardStorageKey = 'currentCard'

const getCardFromStorage = () => {
  const storedCard = localStorage.getItem(cardStorageKey)
  if (storedCard) {
    card.value = JSON.parse(storedCard)
  }
}

const setNewCard = (newValue: { imgUrl: string; message: string; isUsed: boolean }) => {
  card.value = newValue
  localStorage.setItem(cardStorageKey, JSON.stringify(newValue))
}

const setBtnTimer = () => {
  if (!btnDisabledTill.value) {
    return
  }

  const timeOut = btnDisabledTill.value - new Date().getTime()
  if (timeOut <= 0) {
    return
  }

  getCardIsDisabled.value = true

  setTimeout(() => {
    getCardIsDisabled.value = false
    btnDisabledTill.value = null
  }, timeOut)
}

onMounted(() => {
  setBtnTimer()

  getCardFromStorage()
})

const onGetNewCard = async() => {
  const fetchedCard = await cardsStore.getNewCard()

  setNewCard(fetchedCard)
  console.log(Array.isArray(card.value))
  console.log(card.value)

  btnDisabledTill.value = new Date().getTime() + 2000
  setBtnTimer()
  // const
}

const onRefreshCards = () => {
  cardsStore.refreshCards()
  card.value = null
}

</script>

<template>
  <VContainer v-if="!cardsStore.cardsIsEmpty">
    <div>
      <div v-if="card">
        {{ card.message }}
        <img :src="card.imgUrl" alt="pic">
      </div>
    </div>
    <VBtn
      block
      class="mt-2"
      :disabled="getCardIsDisabled || cardsStore.unusedCardsIsEmpty"
      @click="onGetNewCard"
    >
      get Card
    </VBtn>
    <VBtn
      block
      class="mt-2"
      :disabled="!cardsStore.unusedCardsIsEmpty"
      @click="onRefreshCards"
    >
      refresh list
    </VBtn>
  </VContainer>
  <VContainer v-else>
    <VListItem to="/newCard">
      Add ur cards first
    </VListItem>
  </VContainer>
</template>
