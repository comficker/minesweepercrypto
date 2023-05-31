<template>
  <div class="border rounded-lg p-4 space-y-2 bg-white">
    <div class="uppercase font-bold text-gray-400 text-xs">More fun with friends</div>
    <div class="text-2xl font-bold flex items-center gap-1">
      <span>Earn </span>
      <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
      <span class="underline">1</span>
      <span>For each</span>
    </div>
    <div class="uppercase space-y-2">
      <div class="text-xs font-semibold">Your referral code</div>
      <div class="flex bg-yellow-50 p-2 gap-2">
        <input
          type="text" disabled class="flex-1 w-full outline-none text-sm font-semibold"
          :value="referUri"
        >
        <div class="w-4 h-4 i-icons-copy cursor-pointer" @click="copy"/>
      </div>
      <div class="flex gap-2 text-xs">
        <ShareNetwork
          v-for="n in supportedNetworks"
          :network="n"
          :url="data.url"
          :title="data.title"
          :description="data.description"
          :quote="data.quote"
          :hashtags="data.hashtags"
        >
          <div class="flex p-1 gap-1 text-white rounded-sm font-semibold text-xs uppercase flex-wrap" :style="{backgroundColor: networkColors[n]}">
            <div :class="`w-4 h-4 i-icons-${n}`"></div>
            <span class="hidden md:block">{{n}}</span>
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
import {appName, appDescription} from "~/constants";
import {computed} from "vue";
import {useUserStore} from "~/composables/user";

const {showHistory} = defineProps<{ showHistory: boolean }>()
const userStore = useUserStore()
const networkColors = {
  facebook: '#1877f2',
  telegram: '#0088cc',
  twitter: '#1da1f2',
  pinterest: '#e60023'
}
const supportedNetworks = ['telegram', 'twitter', 'pinterest', 'facebook']
const referUri = computed(() => {
  return `https://minesweeperbattle.com?ref=${userStore.logged.username}`
})

const data = computed(() => ({
  title: 'You got an invite for play game on minesweeperbattle.com',
  description: appDescription,
  url: referUri.value,
  hashtags: 'minesweeper,minesweeperonline,minesweeperbattle'
}))

const copy = async () => {
  try {
    await navigator.clipboard.writeText(referUri.value);
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
</script>
