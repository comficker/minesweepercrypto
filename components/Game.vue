<template>
  <div class="space-y-4">
    <div v-if="route.path === '/'" class="grid grid-cols-3 gap-3 uppercase font-bold text-xs">
      <div
        v-for="item in modes" :key="item.name"
        class="border p-3 py-2 bg-white rounded cursor-pointer"
        @click="setSize(item)"
      >
        <div class="flex items-center justify-between">
          <div class="hidden md:block">{{ item.name }}</div>
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
    <game-header/>
    <game-body/>
    <game-result/>
    <game-activity/>
  </div>
</template>

<script lang="ts" setup>
import GameHeader from "~/components/GameHeader.vue";
import GameBody from "~/components/GameBody.vue";
import GameResult from "~/components/GameResult.vue";
import {useCookie} from "#app";
import {useGameStore} from "~/stores/game";

const cookieFormSize = useCookie('form.size')
const route = useRoute()
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
