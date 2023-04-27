/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore } from 'pinia'

import { useStorage } from '@vueuse/core'

import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { useDatabaseList, useFirebaseStorage, useStorageFile } from 'vuefire'

import { ref as dbRef, getDatabase, push, set } from 'firebase/database'

import { useAuthStore } from '@/stores/auth'

import type { RemovableRef } from '@vueuse/core'

// Get a reference to the storage service, which is used to create references in your storage bucket

export const useCardStore = defineStore('cardsStore', () => {
  // const cards: Ref<{ id: string }[]> = useStorage('f', [])
  // const userId: Ref<string| null> = useStorage('userId', null)

  const usedCardIds: RemovableRef<Set<string>> = useStorage<Set<string>>('usedCardIds', new Set())
  // const usedCardIds = useStorage<Set<string>>('usedCardIds', new Set())

  // const authStore = useAuthStore()

  const db = getDatabase()
  const cardsRef = dbRef(db, 'cards')
  // console.log(todosRef)
  // const newFileRef = push(todosRef, 23432)
  // set(newFileRef, {
  //   name: 'firstTodo',
  // })
  const cards = useStorage('todos', useDatabaseList(cardsRef))
  // console.log(cards.value)

  const firebaseStorage = useFirebaseStorage()
  const string = 'fsdlfdsf'

  // Create a storage reference from our storage service

  usedCardIds.value.add('3')
  // usedCardIds.add(23)

  // console.log(usedCardIds)

  // cards[0].title = 'hi'

  console.log('hi')
  const createCard = async(message: string, picture: File) => {
    try {
      console.log(0)
      const firebaseStorageRef = await storageRef(firebaseStorage, `images/${picture.name}`)
      console.log(1)
      const {
        upload,
      } = useStorageFile(firebaseStorageRef)
      await upload(picture)

      console.log(2)

      try {
        const url = await getDownloadURL(firebaseStorageRef)
        console.log('url: ', url)
      }
      catch (error) {
        console.log('er', error)
      }

      const newFileRef = push(cardsRef, {
        picUrl: await getDownloadURL(firebaseStorageRef),
        message,
      })
    }
    catch (error) {
      console.log('er', error)
    }

    console.log('hi')
    // set(newFileRef, {
    //   // name: 'firstTodo',
    //   picUrl: await getDownloadURL(firebaseStorageRef),
    //   message,
    // })
  }

  return { createCard, cards, cardsRef, string }
})
