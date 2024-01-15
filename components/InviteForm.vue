<template>
  <div class="border rounded p-3 space-y-2 bg-white">
    <div class="uppercase font-bold text-xs">Play together!</div>
    <div class="space-y-2">
      <div class="flex bg-yellow-50 p-2 gap-2 items-center">
        <input
          type="text" disabled class="flex-1 w-full outline-none text-lg font-semibold font-mono"
          :value="referUri"
        >
        <div class="w-4 h-4 i-icons-copy cursor-pointer" @click="copy"/>
      </div>
      <div class="font-bold flex items-center gap-3 text-3xl">
        <span>Get </span>
        <img src="/coin.png" alt="" class="w-8 h-8">
        <span class="underline">10</span>
      </div>
      <p>For each invitee.</p>
      <div class="grid grid-cols-3 gap-2 flex-col text-xs">
        <ShareNetwork
          v-for="n in supportedNetworks"
          :network="n"
          :url="data.url"
          :title="data.title"
          :description="data.description"
          :quote="data.quote"
          :hashtags="data.hashtags"
        >
          <div class="flex p-2 gap-1 text-white rounded-sm font-semibold text-xs uppercase flex-wrap" :style="{backgroundColor: networkColors[n]}">
            <div :class="`w-4 h-4 i-icons-${n}`"></div>
            <span>{{n}}</span>
          </div>
        </ShareNetwork>
      </div>
    </div>
    <div v-if="showHistory" class="space-y-1">
      <div class="text-xs font-semibold uppercase">Your friends</div>
      <ul class="space-y-1">
        <li class="flex justify-between items-center font-bold">
          <span>Lam</span>
          <span class="flex items-center gap-1">
          <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
          <span>+2</span>
        </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {appDescription} from "~/constants";
import {computed} from "vue";
import {useUserStore} from "~/stores/user";
import {useRoomStore} from "~/stores/room";


const {showHistory} = defineProps<{ showHistory: boolean }>()
const roomStore = useRoomStore()
const userStore = useUserStore()
const networkColors = {
  facebook: '#1877f2',
  telegram: '#0088cc',
  twitter: '#1da1f2',
}
const supportedNetworks = ['telegram', 'twitter', 'facebook']
const referUri = computed(() => {
  return `https://minesweeperbattle.com${roomStore.data.id ? `/room/${roomStore.data.id}` : '/'}?ref=${userStore.logged.username}`
})

const data = computed(() => ({
  title: 'You got an invite for play room on minesweeperbattle.com',
  description: appDescription,
  url: referUri.value,
  hashtags: 'minesweeper,minesweeperonline,minesweeperbattle'
}))

const copy = async () => {
  try {
    await navigator.clipboard.writeText(referUri.value);
  } catch (err) {
  }
}
</script>
