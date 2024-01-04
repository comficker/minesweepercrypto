<template>
  <div class="space-y-3 w-full max-w-lg mx-auto">
    <div class="space-y-2">
      <div v-if="false" class="flex items-center justify-between">
        <div>Balance</div>
        <div v-if="user && user.id" class="flex gap-2 items-center text-sm">
          <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
          <b>{{ user.meta?.minesweeper?.balance || 0 }}</b>
        </div>
      </div>
      <invite-form :show-history="false"/>
    </div>
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
