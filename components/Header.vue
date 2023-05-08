<script lang="ts" setup>
import {computed} from "vue"
import {useUserStore} from "~/composables/user";
import Login from "~/components/Login.vue";
import Setting from "~/components/Setting.vue";

const userStore = useUserStore()

const modalOpening = computed(() => {
  return userStore.modalOpening
})

const user = computed(() => {
  return userStore.logged
})

</script>

<template>
  <div class="w-full max-w-xl mx-auto relative z-10">
    <div class="py-4 space-y-4 flex justify-between gap-4 items-center">
      <div class="flex flex-wrap gap-6 text-xs uppercase font-bold">
        <nuxt-link to="/" class="flex items-center gap-2 text-base">
          <img class="h-10 w-auto" src="/logo.png" alt="MinesweeperCrypto">
        </nuxt-link>
      </div>
      <div class="flex gap-3 items-center">
        <div v-if="user && user.id" class="hidden md:flex gap-2 items-center text-sm">
          <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
          <b>{{user.meta?.minesweeper?.balance || 0}}</b>
        </div>
        <div v-if="user && user.id" class="flex gap-1 items-center rounded-xl p-2 shadow bg-neutral-800 text-orange-500 cursor-pointer">
          <div class="i-icons-swap w-4 h-4"/>
          <span class="uppercase text-xs font-bold">Manage</span>
        </div>
        <div
          v-else class="rounded-xl p-2 shadow cursor-pointer bg-neutral-800 text-orange-500 cursor-pointer flex gap-2"
          @click="userStore.setModal('login')"
        >
          <div class="i-icons-account w-4 h-4"/>
          <span class="hidden md:block text-xs uppercase font-bold">Signin</span>
        </div>
      </div>
    </div>
    <Transition
      enter-active-class="animated animated-faster animated-fade-in-down"
      leave-active-class="animated animated-faster animated-fade-out-up"
    >
      <div v-if="modalOpening" class="absolute top-0 left-0 right-0">
        <div class="p-4 md:p-8 bg-white shadow rounded-bl-lg rounded-br-lg relative z-10">
          <div class="mx-auto md:w-2/3 ">
            <Login v-if="modalOpening === 'login'"/>
            <Setting v-if="modalOpening === 'setting'"/>
          </div>
        </div>
        <div class="absolute cursor-pointer -bottom-5 right-0 left-0" @click="userStore.setModal(null)">
          <div class="shadow mx-auto h-6 w-10 rounded-bl-full rounded-br-full bg-white">
            <div class="mx-auto i-icons-up w-6 h-6"/>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
input:-internal-autofill-selected {
  background-color: white !important;
}
</style>
