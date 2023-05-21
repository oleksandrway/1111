<script setup lang="ts">
// import { useCurrentUser } from 'vuefire'

// import { useAuthStore } from '@/stores/auth'

// const user = useCurrentUser()

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

<style lang="scss">
  button {
    cursor: pointer;
  }
</style>
