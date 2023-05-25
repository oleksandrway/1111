import { createRouter, createWebHistory } from 'vue-router'

import { useCardStore } from '@/stores/cards'

import Home from '@/views/Home.vue'
import AuthForm from '@/views/AuthForm.vue'
import NewCardForm from '@/views/NewCardForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    {
      path: '/auth',
      component: AuthForm,
    },
    {
      path: '/newCard',
      component: NewCardForm,
    },
    {
      path: '/:pathMatch(.*)*', redirect: () => '/',
    },

  ],
})

router.beforeEach((to, __, next) => {
  const cardsStore = useCardStore()
  const user = computed(() => {
    return cardsStore.user
  })

  if (user.value === null && to.fullPath !== '/auth') {
    next('/auth')
  }
  else if (user.value === null && to.fullPath === '/auth') {
    next()
  }
  else if (user.value === undefined) {
    let nextCalled = false
    watch(() => user.value, () => {
      if (nextCalled)
        return
      if (user.value === null && to.fullPath !== '/auth') {
        next('/auth')
      }
      else if (user.value === null && to.fullPath === '/auth') {
        next()
      }
      else if (user.value && to.fullPath !== '/auth') {
        cardsStore.initCardsStorage().then(() => {
          next()
        })
      }
      else {
        cardsStore.initCardsStorage().then(() => {
          next('/')
        })
      }
      nextCalled = true
    })
  }
  else if (user.value && to.fullPath !== '/auth') {
    cardsStore.initCardsStorage()

    next()
  }
})

export default router
