<script lang="ts" setup>
import {useGameStore} from "~/stores/game";
import {useUserStore} from "~/stores/user";
import {ref, onMounted} from "vue";
import {countDownTimer} from "~/helpers";
import {useRoute} from "nuxt/app";
import {useGlobalStore} from "~/stores/global";

const userStore = useUserStore()
const globalStore = useGlobalStore()
const gs = useGameStore()
const count_down = ref('00:00')
const route = useRoute()

onMounted(() => {
  setInterval(() => {
    if (gs.status === 'playing' && gs.start_at) {
      const to = gs.end_at ? gs.end_at : new Date().getTime()
      count_down.value = countDownTimer(gs.start_at, to)
    } else {
      count_down.value = "00:00"
    }
  }, 1000)
})
</script>


<template>
  <div class="flex gap-4 text-xs font-bold justify-between justify-between">
    <div class="flex items-center gap-3">
      <div class="flex items-center cursor-pointer bg-gray-300 rounded p-0.5">
        <div class="rounded-xl p-2 hover:shadow-inner cursor-pointer" @click="globalStore.setModal('setting')">
          <div class="i-icons-cog w-4 h-4"/>
        </div>
        <div
          class="p-2 px-3 flex gap-1 items-center cursor-pointer bg-white rounded"
          @click="gs.newGame()"
        >
          <span class="uppercase">New <span class="hidden md:inline-flex">Game</span></span>
        </div>
      </div>
      <div
        v-if="gs.is_multiple"
        class="border p-1.5 rounded flex gap-1.5 text-xs uppercase font-semibold items-center"
      >
        <div
          v-for="item in gs.players" :key="item.id"
          class="p-1 px-2 rounded bg-red-500 text-white flex gap-1 items-center"
        >
          <div class="i-icons-account w-4 h-4"/>
          <span>You</span>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="shadow-inner p-2 rounded flex gap-2 items-center">
        <div class="i-icons-alarm w-5 h-5"/>
        <div>{{ count_down }}</div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="shadow-inner p-2 rounded hidden md:flex gap-2 items-center">
        <div>{{ gs.width }}x{{ gs.height }}</div>
      </div>
      <div
        v-if="['win', 'dead', 'replaying'].includes(gs.status) || gs.ending"
        class="border p-1.5 h-full rounded flex gap-3 items-center text-gray-400"
      >
        <div
          class="cursor-pointer"
          :class="{'text-blue-500': gs.status !== 'replaying'}"
          @click="gs.replay()"
        >
          <div class="i-icons-replay w-4 h-4"/>
        </div>
        <div
          class="cursor-pointer"
          :class="{'text-blue-500': gs.status === 'replaying'}"
          @click="gs.stopPlay()"
        >
          <div class="i-icons-stop w-5 h-5"/>
        </div>
      </div>
      <template v-else>
        <div class="shadow-inner p-2 rounded flex gap-2 items-center">
          <div class="i-icons-bomb w-5 h-5"/>
          <div>{{ gs.total_bomb }}</div>
        </div>
      </template>
      <div
        v-if="!gs.ending"
        class="p-2 rounded flex gap-2 items-center cursor-pointer duration-300"
        :class="gs.is_flagging ? 'shadow-inner bg-green-100': 'shadow hover:shadow-lg duration-200 bg-white text-neutral-800'"
        @click="gs.toggleFlag()"
      >
        <div class="i-icons-flag w-5 h-5"/>
      </div>
    </div>
  </div>
</template>
