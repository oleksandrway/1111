<template>
  <VDialog v-model="dialogVisible" width="auto">
    <VCard>
      <VCardText>
        {{ props.message }}
      </VCardText>
      <VCardActions>
        <VBtn
          color="primary"
          block
          @click="dialogVisible = false"
        >
          Close Dialog
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script lang="ts">
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const dialogVisible = ref(false)

    return { props, dialogVisible }
  },
}

</script>
