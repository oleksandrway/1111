import { defineStore } from 'pinia'

import { useStorage } from '@vueuse/core'

import { useAuthStore } from '@/stores/auth'

import type { RemovableRef } from '@vueuse/core'

export const useCardStore = defineStore('cardsStore', () => {
  const cards: Ref<{ id: string }[]> = useStorage('f', [])
  // const userId: Ref<string| null> = useStorage('userId', null)

  const usedCardIds: RemovableRef<Set<string>> = useStorage('usedCardIds', new Set())
  const authStore = useAuthStore()

  usedCardIds.value.add(3)
  // usedCardIds.add(23)

  console.log(usedCardIds)

  // cards[0].title = 'hi'

  const createCard = async(message: string, picture: File) => {
    console.log(message)
    console.log(picture)
    // const API_KEY = 'AIzaSyCMjGDT2dQLVoyytrjylwEcjuRvjU7dIdA'
    const bucketName = 'gs://project-3161223530572492402.appspot.com/'
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${picture.name}`

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': picture.type,
      },
      body: picture,
      // For binary data, use "body: file" instead of "body: atob(fileData)"
    })

    const responseData: any = await response.json()
    console.log(responseData)
  }

  return { createCard, cards }
})
