<script lang="ts" setup>
import {computed} from "vue"
import {useUserStore} from "~/stores/user";
import Login from "~/components/Login.vue";
import Setting from "~/components/Setting.vue";
import {useGlobalStore} from "~/stores/global";

const userStore = useUserStore()
const globalStore = useGlobalStore()
const modalOpening = computed(() => {
  return globalStore.modal
})

const user = computed(() => {
  return userStore.logged
})
</script>

<template>
  <div class="w-full max-w-3xl mx-auto relative">
    <div class="pt-4 flex justify-between gap-4 items-center">
      <div class="flex flex-wrap text-xs uppercase items-center font-bold">
        <nuxt-link to="/" class="flex items-center text-base">
          <img class="h-10 w-auto" src="/logo.png" alt="MinesweeperCrypto">
        </nuxt-link>
      </div>
      <div class="flex gap-3 items-center">
        <nuxt-link
          to="/manager"
          v-if="user && user.id"
          class="flex gap-2 items-center p-1.5 text-orange-500 cursor-pointer"
        >
          <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
          <b>{{ user.meta?.minesweeper?.balance || 0 }}</b>
        </nuxt-link>
        <div
          v-else class="rounded p-2.5 shadow cursor-pointer bg-neutral-800 text-orange-500 cursor-pointer flex gap-2"
          @click="globalStore.setModal('login')"
        >
          <div class="i-icons-account w-4 h-4"/>
          <span class="hidden md:block text-xs uppercase font-bold">Login</span>
        </div>
      </div>
    </div>
    <Transition
      enter-active-class="animated animated-faster animated-fade-in-down"
      leave-active-class="animated animated-faster animated-fade-out-up"
    >
      <div v-if="modalOpening" class="fixed inset-0 -z-10" @click="globalStore.setModal('')"></div>
    </Transition>
    <Transition
      enter-active-class="animated animated-faster animated-fade-in-down"
      leave-active-class="animated animated-faster animated-fade-out-up"
    >
      <div v-if="modalOpening" class="absolute z-10 top-0 left-0 right-0">
        <div class="p-4 md:p-8 bg-white shadow rounded-bl-lg rounded-br-lg relative z-10">
          <div class="mx-auto md:w-2/3 ">
            <Login v-if="['login', 'register'].includes(modalOpening)"/>
            <Setting v-if="modalOpening === 'setting'"/>
          </div>
        </div>
        <div class="absolute cursor-pointer -bottom-5 right-0 left-0" @click="globalStore.setModal('')">
          <div class="shadow mx-auto h-6 w-10 rounded-bl-full rounded-br-full bg-white">
            <div class="mx-auto i-icons-up w-6 h-6"/>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
