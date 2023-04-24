import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
// import { routes } from 'vue-router/auto/routes'
// console.warn('routes, ', routes)
// import Popular from '@comp/sections/popular/Popular.vue'
// import Suggestions from '@comp/sections/suggestions/Suggestions.vue'
import Home from '@/views/Home.vue'
import AuthForm from '@/views/AuthForm.vue'
import NewCardForm from '@/views/NewCardForm.vue'

// import About from '@/views/About.vue'

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

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.path !== '/auth' && !authStore.userId) {
    console.log(authStore.userId)

    return { path: '/auth' }
  }
  if (to.path === '/auth' && authStore.userId) {
    return { path: '/' }
  }

  return true
})

export default router
