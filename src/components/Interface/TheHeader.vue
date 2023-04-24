<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const logOut = authStore.logOut
// ...
</script>

<template>
  <VAppBar density="compact">
    <VContainer class="flex items-center py-0">
      <VToolbarTitle>
        <RouterLink to="/">
          Candies
        </RouterLink>
      </VToolbarTitle>

      <VMenu>
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
            Add Candy
          </VListItem>

          <VBtn @click="logOut">
            Logout
          </VBtn>
          <!-- </vlist> -->
        </VCard>
      </VMenu>
    </VContainer>
  </VAppBar>
</template>
