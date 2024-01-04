<template>
  <div v-if="gs.id" class="flex justify-center">
    <div class="flex gap-2">
      <h1 class="text-2xl font-extrabold uppercase">Game #{{ gs.id }}</h1>
      <div
        v-if="gs.status === 'playing'"
        class="flex items-center gap-2 px-4 py-1 rounded bg-red-400 text-white"
      >
        <span>Live</span>
        <div class="relative flex h-3 w-3">
          <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></div>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </div>
      </div>
      <div
        v-else
        class="font-semibold px-4 py-1 rounded capitalize"
        :class="{
          'bg-gray-200': gs.status === 'dead',
          'bg-green-500 text-white': gs.status === 'win'
        }"
      >{{ gs.status }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useGameStore} from "~/stores/game";

const gs = useGameStore()
</script>

<style scoped>

</style>
