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
    <div v-if="roomStore.data.id" class="flex justify-between">
      <div class="flex gap-2">
        <h1 class="text-2xl font-extrabold uppercase">Game #{{ roomStore.data.id }}</h1>
        <div
          v-if="roomStore.data.status === 'playing'"
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
          :class="roomStore.data.status === 'won' ? 'bg-green-500 text-white': 'bg-gray-100'"
        >{{ roomStore.data.status }}
        </div>
      </div>
      <div
        class="font-semibold px-4 py-1 rounded capitalize"
        :class="roomStore.joinStatus === 'join' ? 'bg-blue-500 text-white cursor-pointer': 'bg-gray-200'"
        @click="joinGame"
      >{{roomStore.joinStatus}}
      </div>
    </div>
    <game-activity/>
  </div>
</template>

<script lang="ts" setup>
import GameHeader from "~/components/GameHeader.vue";
import GameBody from "~/components/GameBody.vue";
import {useCookie} from "#app";
import {useRoomStore} from "~/stores/room";
import {useUserStore} from "~/stores/user";
import {useGlobalStore} from "~/stores/global";

const cookieFormSize = useCookie('form.size')
const route = useRoute()
const roomStore = useRoomStore()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const modes = ref([
  {w: 8, h: 8, name: 'Beginner', stars: [1, 0, 0]},
  {w: 16, h: 16, name: 'Intermediate', stars: [1, 1, 0]},
  {w: 32, h: 32, name: 'Expert', stars: [1, 1, 1]}
])

const setSize = (mode: any) => {
  cookieFormSize.value = `${mode.w}_${mode.h}`
  roomStore.setting({
    ...roomStore.options,
    width: mode.w,
    height: mode.h,
    num_bomb: Math.floor(mode.w * mode.h * 0.2)
  })
  roomStore.makeGame(true)
}

const joinGame = () => {
  if (roomStore.joinStatus === 'join') {
    if (userStore.isLogged) {
      useAuthFetch('/gms/join', {
        method: "POST",
        body: {
          id: roomStore.data.id
        },
        immediate: true
      })
    } else {
      globalStore.setModal('login')
    }
  }
}
</script>
