<script setup lang="ts">
//
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
