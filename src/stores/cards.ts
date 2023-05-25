
import type { DatabaseReference } from 'firebase/database'

import imageCompression from 'browser-image-compression'

import { child, ref as dbRef, get, getDatabase, push, set } from 'firebase/database'

import { defineStore } from 'pinia'

import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { useCurrentUser, useFirebaseStorage, useStorageFile } from 'vuefire'

interface CardObject { message: string; isLearned: boolean; imgUrl?: string }

export const useCardStore = defineStore('cardsStore', () => {
  const user = useCurrentUser()

  const db = getDatabase()
  const cardsFolderName = 'cards'

  const cardsLink = ref<string | null>(null)
  const cardsRef = ref<DatabaseReference | null>(null)
  const cards = ref<[string, CardObject][]>([])
  const cardsIsEmpty = computed(() => !cards.value.length)
  const currentCardIndex = ref(0)

  const unLearnedCards = computed(() => cards.value.filter(card => !card[1].isLearned))
  const unLearnedCardsIsEmpty = computed(() => !unLearnedCards.value.length)

  const userId = ref<string | null | undefined>(null)

  const getCards = async(cardsRef: DatabaseReference) => {
    cards.value = await get(child(cardsRef, '/')).then((snapshot) => {
      if (snapshot.val()) {
        return Object.entries(snapshot.val())
      }
      return []
    })
  }

  const initCardsStorage = async() => {
    userId.value = await user.value?.uid

    cardsLink.value = `${cardsFolderName}/${userId.value}`
    cardsRef.value = dbRef(db, cardsLink.value)
    getCards(cardsRef.value)
  }

  const firebaseStorage = useFirebaseStorage()

  const createCard = async(message: string, picture?: File) => {
    let cardObject: CardObject = {
      message,
      isLearned: false,
    }

    if (picture) {
      const options = {
        maxSizeMB: 2,
        useWebWorker: true,
      }

      const compressedPicture = await imageCompression(picture, options)

      const firebaseStorageRef = await storageRef(firebaseStorage, `users/${userId.value}/${picture.name}`)
      const {
        upload,
      } = useStorageFile(firebaseStorageRef)
      await upload(compressedPicture)

      const imgUrl = await getDownloadURL(firebaseStorageRef)
      cardObject = {
        ...cardObject,
        imgUrl,
      }
    }

    if (!cardsRef.value) {
      return
    }

    push(cardsRef.value, cardObject)
    getCards(cardsRef.value)
  }

  const changeCardStatus = async(cardId: string, status: boolean) => {
    if (!cardsRef.value) {
      return
    }
    const cardStatusLink = ref(`${cardsLink.value}/${cardId}/isLearned`)
    const cardStatusRef = dbRef(db, cardStatusLink.value)
    await set(cardStatusRef, status)
    await getCards(cardsRef.value)
  }

  const setCardAsLearned = async(cardId: string) => {
    await changeCardStatus(cardId, true)
  }

  const getNewCard = async() => {
    if (currentCardIndex.value >= 0
      && currentCardIndex.value < unLearnedCards.value.length - 1) {
      currentCardIndex.value++
    }
    else {
      currentCardIndex.value = 0
    }

    const card = unLearnedCards.value[currentCardIndex.value]

    if (card) {
      const cardObj = {
        id: card[0],
        ...card[1],
      }

      if (unLearnedCards.value.length === 1) {
        setCardAsLearned(cardObj.id)
      }
      return cardObj
    }

    return null
  }

  const refreshCards = async() => {
    for (const card of cards.value) {
      await changeCardStatus(card[0], false)
    }
  }

  return {
    createCard,
    cardsRef,
    initCardsStorage,
    user,
    cards,
    cardsIsEmpty,
    unLearnedCards,
    unLearnedCardsIsEmpty,
    changeCardStatus,
    setCardAsLearned,
    getNewCard,
    refreshCards,
  }
})
