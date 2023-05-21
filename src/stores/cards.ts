/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import type { DatabaseReference } from 'vuefire'

import type { VueDatabaseQueryData, _RefDatabase } from 'vuefire'

import type { DatabaseReference } from 'firebase/database'

import imageCompression from 'browser-image-compression'

import { child, ref as dbRef, get, getDatabase, push, set } from 'firebase/database'

import { defineStore } from 'pinia'

import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { useCurrentUser, useFirebaseStorage, useStorageFile } from 'vuefire'

export const useCardStore = defineStore('cardsStore', () => {
  const user = useCurrentUser()

  const db = getDatabase()
  const cardsFolderName = 'cards'

  const cardsLink = ref<string | null>(null)
  const cardsRef = ref<DatabaseReference | null>(null)
  const cards = ref<[string, { imgUrl: string; message: string; isUsed: boolean }][]>([])
  const cardsIsEmpty = computed(() => !cards.value.length)

  console.log(cards.value.filter(card => !card[1].isUsed))

  const unusedCards = computed(() => cards.value.filter(card => !card[1].isUsed))
  const unusedCardsIsEmpty = computed(() => !unusedCards.value.length)

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

  const createCard = async(message: string, picture: File) => {
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

    if (!cardsRef.value) {
      return
    }

    push(cardsRef.value, {
      imgUrl: await getDownloadURL(firebaseStorageRef),
      message,
      isUsed: false,
    })
    getCards(cardsRef.value)
  }

  const changeCardStatus = async(cardId: string, status: boolean) => {
    if (!cardsRef.value) {
      return
    }
    const cardStatusLink = ref(`${cardsLink.value}/${cardId}/isUsed`)
    const cardStatusRef = dbRef(db, cardStatusLink.value)
    set(cardStatusRef, status)
    getCards(cardsRef.value)
  }

  const getNewCard = async() => {
    const card = unusedCards.value[0]

    changeCardStatus(card[0], true)
    return card[1]
  }

  const refreshCards = async() => {
    console.log('refresh')
    console.log(cards.value)
    cards.value.forEach((card) => {
      console.log(card)
      changeCardStatus(card[0], false)
    })
  }

  return {
    createCard,
    cardsRef,
    initCardsStorage,
    user,
    cards,
    cardsIsEmpty,
    unusedCards,
    unusedCardsIsEmpty,
    changeCardStatus,
    getNewCard,
    refreshCards,
  }
})
