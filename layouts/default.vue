<template>
  <main
    id="main"
    class="flex flex-col text-emerald-800 min-h-full gap-4 px-4 bg-[#faf8ef]"
    :class="{'h-full overflow-hidden': !!modalOpening}"
  >
    <Header class="z-20"/>
    <div v-if="!!modalOpening" class="fixed inset-0 z-10"/>
    <div class="flex-1 flex flex-col" :class="{'blur-sm': !!modalOpening}">
      <div class="w-full">
        <slot/>
      </div>
    </div>
    <Footer/>
  </main>
</template>
<script setup lang="ts">
import {useUserStore} from "~/composables/user";
import {computed} from "vue";
import {useRoute} from "#app";
import {onMounted} from "@vue/runtime-core";
import Game from "~/components/Game.vue";
const route = useRoute()
const userStore = useUserStore()
const modalOpening = computed(() => {
  return userStore.modalOpening
})

onMounted(() => {
  if (route.query.ref) {
    userStore.setModal('login')
  }
})
</script>
<style>
</style>
