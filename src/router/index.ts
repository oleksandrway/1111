import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
// import { routes } from 'vue-router/auto/routes'
// console.warn('routes, ', routes)
// import Popular from '@comp/sections/popular/Popular.vue'
// import Suggestions from '@comp/sections/suggestions/Suggestions.vue'
import Home from '@/views/Home.vue'
import AuthForm from '@/views/AuthForm.vue'

// import About from '@/views/About.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    {
      path: '/auth',
      component: AuthForm,
      // beforeEnter() {
      //   const authStore = useAuthStore()
      //   console.log(authStore)
      //   console.log(authStore.userId)
      // },
    },
    { path: '/*', redirect: '/' },
    // { path: '/about', component: About },

  ],
})

router.beforeEach(() => {
  // const authStore = useAuthStore()
  // console.log(to)
  // console.log(to, authStore.userId)
  // if (to.path !== '/auth' && !authStore.userId) {
  //   console.log(authStore.userId)

  //   return { path: '/auth' }
  // }

  // return true
})

export default router
