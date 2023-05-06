<template>
  <main
    id="main"
    class="flex flex-col text-emerald-800 min-h-full gap-4 px-4 bg-[#faf8ef]"
    :class="{'h-full overflow-hidden': modalOpening}"
  >
    <Header/>
    <div class="flex-1 flex flex-col" :class="{'blur-sm': modalOpening}">
      <slot class="w-full"/>
    </div>
    <Footer/>
  </main>
</template>
<script setup lang="ts">
import {useUserStore} from "~/composables/user";
import {computed} from "vue";

const userStore = useUserStore()
const modalOpening = computed(() => {
  return userStore.modalOpening
})
</script>
<style>
</style>
