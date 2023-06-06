<template>
  <div class="space-y-4">
    <div class="flex justify-between text-xs font-bold uppercase">
      <a target="_blank" class="underline flex items-center gap-1" href="/how-to-play">
        <span>How to play minesweeper?</span>
      </a>
      <div class="flex justify-end gap-6 flex-wrap grayscale">
        <div id="market-telegram" class="flex gap-1 items-center">
          <img class="w-4" width="32" height="32" src="/market/telegram.png" alt="">
          <div class="hidden md:block">
            <div>Telegram</div>
          </div>
        </div>
        <div id="market-apple" class="flex gap-1 items-center">
          <img class="w-4" width="32" height="32" src="/market/apple-logo.png" alt="">
          <div class="hidden md:block">
            <div>IOS</div>
          </div>
        </div>
        <div id="market-google" class="flex gap-1 items-center">
          <img class="w-4" width="32" height="32" src="/market/google-play-logo.png" alt="">
          <div class="hidden md:block">
            <div>Android</div>
          </div>
        </div>
      </div>
    </div>
    <game-body/>
    <game-header/>
    <div class="grid md:grid-cols-3 gap-3 uppercase font-bold text-xs">
      <div
        v-for="item in modes" :key="item.name"
        class="border p-3 py-2 bg-white rounded cursor-pointer"
        @click="setSize(item)"
      >
        <div class="flex items-center justify-between">
          <div>{{ item.name }}</div>
          <div class="flex">
            <div
              v-for="i in item.stars" :key="i"
              class="w-3 h-3"
              :class="{'i-icons-star': i, 'i-icons-star-outline': !i}"
            />
          </div>
        </div>
        <div class="flex items-center gap-1 text-xl">
          <span>{{ item.w }}</span>
          <div class="i-icons-close-thick w-3 h-3"/>
          <span>{{ item.h }}</span>
        </div>
      </div>
    </div>
    <game-result/>
  </div>
</template>

<script lang="ts" setup>
import GameHeader from "~/components/GameHeader.vue";
import GameBody from "~/components/GameBody.vue";
import GameResult from "~/components/GameResult.vue";
import {useCookie} from "#app";
import {useGameStore} from "~/composables/game";

const cookieFormSize = useCookie('form.size')
const gs = useGameStore()
const modes = ref([
  {w: 8, h: 8, name: 'Beginner', stars: [1, 0, 0]},
  {w: 16, h: 16, name: 'Intermediate', stars: [1, 1, 0]},
  {w: 32, h: 32, name: 'Expert', stars: [1, 1, 1]}
])

const setSize = (mode: any) => {
  cookieFormSize.value = `${mode.w}_${mode.h}`
  gs.saveSetting({
    width: mode.w,
    height: mode.h,
    is_multiple: gs.is_multiple
  })
}
</script>
