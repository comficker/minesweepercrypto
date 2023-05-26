<template>
  <div v-if="gs.id" class="flex justify-between flex-wrap gap-3">
    <div class="flex gap-2">
      <h1 class="text-3xl font-extrabold uppercase">Game #{{ gs.id }}</h1>
      <div
        v-if="gs.status === 'playing'"
        class="flex items-center text-xl gap-2 px-4 py-1 rounded bg-red-400 text-white"
      >
        <span>Live</span>
        <div class="relative flex h-4 w-4">
          <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></div>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
        </div>
      </div>
      <div
        v-else
        class="font-semibold px-4 py-1 rounded text-xl uppercase"
        :class="{
            'bg-gray-200': gs.status === 'dead',
            'bg-green-500 text-white': gs.status === 'win'
          }"
      >{{ gs.status }}
      </div>
    </div>
    <div class="flex justify-center flex-wrap gap-3 md:text-lg text-white">
      <div v-if="gs.host" class="flex rounded overflow-hidden font-semibold">
        <div class="bg-gray-200 text-gray-500 px-3 py-1">Host</div>
        <div class="bg-green-400 px-3 py-1">{{ gs.host?.first_name || gs.host?.username }}</div>
      </div>
      <div class="flex rounded overflow-hidden font-semibold">
        <div class="bg-gray-200 text-gray-500 px-3 py-1">Size</div>
        <div class="bg-green-400 px-3 py-1">{{ gs.width }}x{{ gs.height }}</div>
      </div>
    </div>
  </div>
  <div v-if="gs.players.length" class="rounded shadow overflow-hidden w-full bg-white px-3 pb-2 text-sm">
    <table class="min-w-full table-fixed overflow-auto">
      <thead>
      <tr role="rowheader" class="font-semibold text-right">
        <th role="columnheader" class="px-2 pl-2 pr-2 sm:pl-0 text-left">Results</th>
        <th role="columnheader" class="w-32 px-2 py-1.5">Time</th>
        <th role="columnheader" class="w-32 px-2 py-1.5">Score</th>
      </tr>
      </thead>
      <tbody class="whitespace-nowrap font-bold">
      <tr role="row" v-for="(item, i) in gs.players" :key="i" class="rounded text-right">
        <td class="px-2 py-2 text-left">{{ item.user.username }}</td>
        <td class="px-2 py-2" :class="{
            'text-blue-500': item.status === 'win',
            'text-red-500': item.status === 'dead'
          }">0
        </td>
        <td class="px-2 py-2">{{ item.score || 0 }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import {useGameStore} from "~/composables/game";

const gs = useGameStore()
</script>

<style scoped>

</style>
