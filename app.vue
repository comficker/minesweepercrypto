<script setup lang="ts">
import { appName } from '~/constants'
useHead({
  title: appName,
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
