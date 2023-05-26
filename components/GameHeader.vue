<template>
  <div class="flex grid-cols-3 gap-4 text-xs font-bold justify-between md:grid">
    <div class="flex items-center gap-3">
      <div
        class="p-2 rounded flex gap-2 items-center cursor-pointer duration-300"
        :class="{
          'shadow hover:shadow-lg duration-200 bg-white text-neutral-800': !gs.is_flagging,
          'shadow-inner bg-green-100': gs.is_flagging
        }"
        @click="gs.toggleFlag()"
      >
        <div class="i-icons-flag w-5 h-5"/>
      </div>
    </div>
    <div class="flex justify-center">
      <div
        v-if="route.path === '/' && !gs.is_multiple"
        class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
        @click="gs.newGame()"
      >
        <div class="hidden md:block i-icons-dead w-5 h-5"/>
        <span class="uppercase">New Game</span>
      </div>
      <div
        v-else-if="gs.is_multiple"
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
    <div class="md:w-auto w-1/2 flex items-center gap-3 justify-end">
      <div class="shadow-inner p-2 rounded flex gap-2 items-center">
        <div class="i-icons-alarm w-5 h-5"/>
        <div>{{ count_down }}</div>
      </div>
      <div
        v-if="['win', 'dead', 'replaying'].includes(gs.status) || gs.ending"
        class="border p-2 rounded flex gap-3 items-center text-gray-400"
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
        <div class="rounded-xl p-2 shadow cursor-pointer" @click="userStore.setModal('setting')">
          <div class="i-icons-cog w-4 h-4"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useGameStore} from "~/composables/game";
import {useUserStore} from "~/composables/user";
import {ref, onMounted} from "vue";
import {countDownTimer} from "~/helpers";
import {useRoute} from "nuxt/app";

const userStore = useUserStore()
const gs = useGameStore()
const count_down = ref('00:00')
const route = useRoute()

onMounted(() => {
  setInterval(() => {
    if (gs.status === 'playing' && gs.start_at) {
      const to = gs.end_at ? gs.end_at : new Date().getTime()
      count_down.value = countDownTimer(gs.start_at, to)
    }
  }, 1000)
})
</script>

<style scoped>

</style>
