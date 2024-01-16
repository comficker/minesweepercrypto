<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from "#app";
import {onMounted} from "@vue/runtime-core";
import {useGlobalStore} from "~/stores/global";
import {useUserStore} from "~/stores/user";
import InviteForm from "~/components/InviteForm.vue";
import Lobby from "~/components/Lobby.vue";
import {useNuxtApp} from "#imports";
const {$logout} = useNuxtApp()
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
    class="bg-white text-emerald-800 min-h-full px-4 gap-4"
    :class="{'h-full overflow-hidden': !!modalOpening}"
  >
    <div class="flex-1 space-y-4">
      <Header class="z-20"/>
      <div v-if="!!modalOpening" class="fixed inset-0 z-10"/>
      <div class="max-w-lg mx-auto w-full" :class="{'blur-sm': !!modalOpening}">
        <div class="space-y-4 pb-4">
          <slot/>
        </div>
        <div v-if="!modalOpening" class="md:w-72 xl:w-80 md:fixed right-0 top-0 bottom-0 bg-white flex flex-col md:divide-y md:border-l z-30">
          <div class="flex-1 relative">
            <div class="md:absolute inset-0 overflow-auto">
              <client-only>
                <lobby class="md:p-3"/>
              </client-only>
            </div>
          </div>
          <div class="md:w-full md:mx-auto text-xs font-bold uppercase underline bg-gray-50 flex gap-2 p-3 -mx-3">
            <nuxt-link to="/history">
              <span>History</span>
            </nuxt-link>
            <nuxt-link to="/leaderboard">
              <span>Leaderboard</span>
            </nuxt-link>
            <div class="cursor-pointer ml-auto" @click="$logout">Logout</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
