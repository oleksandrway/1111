<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const onLogOut = () => {
  authStore.logOut()
}
// ...
</script>

<template>
  <VAppBar density="compact">
    <VContainer class="flex items-center py-0">
      <VToolbarTitle>
        <RouterLink to="/">
          Cards
        </RouterLink>
      </VToolbarTitle>

      <VMenu v-if="authStore.user">
        <template #activator="{props}">
          <VBtn
            density="comfortable"
            icon
            v-bind="props"
          >
            <VIcon>
              mdi-menu
            </VIcon>
          </VBtn>
        </template>

        <VCard width="200">
          <!-- <VList> -->
          <VListItem to="/newCard">
            Add Card
          </VListItem>
          <VListItem @click="onLogOut">
            Logout
          </VListItem>
        </VCard>
      </VMenu>
    </VContainer>
  </VAppBar>
</template>
