<template>
  <div class="space-y-3 w-full max-w-lg mx-auto">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div>Balance</div>
        <div v-if="userStore.isLogged" class="flex gap-2 items-center text-3xl">
          <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
          <b>{{ userStore.balance }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {useUserStore} from "~/stores/user";

const userStore = useUserStore()

const user = computed(() => {
  return userStore.logged
})
</script>
