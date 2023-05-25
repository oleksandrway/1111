<script setup lang="ts">

import { useCardStore } from '@/stores/cards'

const cardsStore = useCardStore()

interface Card {id: string; message: string; isLearned: boolean; imgUrl?: string }
const card = ref<Card | null>(null)
const cardStorageKey = 'currentCard'

const getCardFromStorage = () => {
  const storedCard = localStorage.getItem(cardStorageKey)
  if (storedCard) {
    card.value = JSON.parse(storedCard)
  }
}

const cardIsLearned = ref(false)

const setNewCard = (newValue: Card | null) => {
  card.value = newValue
  localStorage.setItem(cardStorageKey, JSON.stringify(newValue))
}

onBeforeMount(() => {
  getCardFromStorage()
})

const getNewCard = async() => {
  const fetchedCard = await cardsStore.getNewCard()

  setNewCard(fetchedCard)
}
const onGetNewCard = async() => {
  if (cardIsLearned.value && card.value) {
    await cardsStore.setCardAsLearned(card.value?.id)
    cardIsLearned.value = false
  }
  getNewCard()
}

const onRefreshCards = async() => {
  await cardsStore.refreshCards()
  getNewCard()
}

</script>

<template>
  <VContainer v-if="!cardsStore.cardsIsEmpty" class="flex justify-center">
    <VCard width="700" class="p-30px ">
      <div>
        <div v-if="card">
          <div v-if="card.imgUrl" class="h-300px <sm:h-200px mb-20px">
            <img
              class="h-full w-full object-contain"
              :src="card.imgUrl"
              alt="pic"
            >
          </div>
          {{ card.message }}
        </div>
      </div>
      <br>
      <VCheckbox
        v-model="cardIsLearned"
        :disabled="cardsStore.unLearnedCardsIsEmpty"
        label="set as learned card"
        hide-details
      />

      <VBtn
        :disabled="cardsStore.unLearnedCardsIsEmpty"
        class="mt-2"
        variant="tonal"
        @click="onGetNewCard"
      >
        Next Card
      </VBtn>
      <VBtn
        variant="tonal"
        class="mt-2 ml-20px"
        :disabled="!cardsStore.unLearnedCardsIsEmpty"
        @click="onRefreshCards"
      >
        Refresh Cards
      </VBtn>
      <p v-if="cardsStore.unLearnedCardsIsEmpty" class="mt-10px">
        U learned all cards add new or refresh the list to repeat
      </p>
    </VCard>
  </VContainer>
  <VContainer v-else>
    You don't have any cards yet <br>
    <VBtn to="/newCard">
      Add Card
    </VBtn>
  </VContainer>
</template>
