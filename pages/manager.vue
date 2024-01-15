<template>
  <div class="space-y-3 w-full max-w-lg mx-auto">
    <client-only>
      <div class="space-y-2 min-h-md flex flex-col items-center justify-center">
        <div class="flex items-center flex-col gap-3 justify-center">
          <div class="text-xs uppercase font-bold">Balance</div>
          <div v-if="userStore.isLogged" class="flex gap-2 items-center text-6xl">
            <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
            <b>{{ userStore.balance }}</b>
          </div>
        </div>
        <div class="flex justify-center gap-6">
          <div class="bg-blue-500 cursor-pointer rounded p-2 px-6 text-white">Deposit</div>
          <div class="cursor-pointer rounded p-2 px-6">Withdraw</div>
        </div>
      </div>
      <invite-form v-if="userStore.isLogged" :show-history="false"/>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {useUserStore} from "~/stores/user";
import InviteForm from "~/components/InviteForm.vue";

const userStore = useUserStore()

const user = computed(() => {
  return userStore.logged
})
</script>
