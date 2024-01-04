<script setup lang="ts">
import {computed} from "vue";
import {useRoute} from "#app";
import {onMounted} from "@vue/runtime-core";
import {useGlobalStore} from "~/stores/global";
const route = useRoute()
const globalStore = useGlobalStore()
const modalOpening = computed(() => {
  return globalStore.modal
})

onMounted(() => {
  if (route.query.ref) {
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
      <div class="w-full">
        <slot/>
      </div>
    </div>
    <div class="text-center text-xs font-bold uppercase underline my-4 flex gap-2 justify-center">
      <a target="_blank" href="/history">
        <span>History</span>
      </a>
      <a target="_blank" href="/how-to-play">
        <span>How to play minesweeper?</span>
      </a>
    </div>
  </main>
</template>
