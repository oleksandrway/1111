<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
onMounted(() => {
  authStore.setLogOutTimeout()
})
</script>

<template>
  <VApp>
    <TheHeader />
    <VMain>
      <RouterView v-slot="{ Component:ViewComponent }">
        <VFadeTransition :hide-on-leave="true">
          <Component :is="ViewComponent" />
        </VFadeTransition>
      </RouterView>
    </VMain>
  </VApp>
</template>
