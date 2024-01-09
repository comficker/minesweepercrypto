<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from "#app";
import {onMounted} from "@vue/runtime-core";
import {useGlobalStore} from "~/stores/global";
import {useUserStore} from "~/stores/user";
import InviteForm from "~/components/InviteForm.vue";
import Lobby from "~/components/Lobby.vue";
const route = useRoute()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const modalOpening = computed(() => {
  return globalStore.modal
})

onMounted(() => {
  if (route.query.ref && !userStore.isLogged) {
    globalStore.setModal('login')
  }
})
</script>


<template>
  <main
    id="main"
    class="flex flex-col bg-white text-emerald-800 min-h-full px-4 gap-4"
    :class="{'h-full overflow-hidden': !!modalOpening}"
  >
    <Header class="z-20"/>
    <div v-if="!!modalOpening" class="fixed inset-0 z-10"/>
    <div class="flex-1 flex flex-col" :class="{'blur-sm': !!modalOpening}">
      <div class="max-w-3xl mx-auto flex md:flex-row flex-col gap-4 w-full">
        <div class="flex-1 space-y-4">
          <slot/>
          <client-only>
            <invite-form v-if="userStore.isLogged" :show-history="false"/>
          </client-only>
        </div>
        <div class="md:w-1/3 space-y-4">
          <lobby/>
        </div>
      </div>
    </div>
    <div class="max-w-3xl mx-auto text-xs font-bold uppercase underline my-4 flex gap-2">
      <a target="_blank" href="/history">
        <span>History</span>
      </a>
      <a target="_blank" href="/how-to-play">
        <span>How to play minesweeper?</span>
      </a>
    </div>
  </main>
</template>
