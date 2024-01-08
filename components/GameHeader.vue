<script lang="ts" setup>
import {useUserStore} from "~/stores/user";
import {ref, onMounted} from "vue";
import {countDownTimer} from "~/helpers";
import {useRoute} from "nuxt/app";
import {useGlobalStore} from "~/stores/global";
import {useRoomStore} from "~/stores/room";

const userStore = useUserStore()
const globalStore = useGlobalStore()
const roomStore = useRoomStore()
const count_down = ref('00:00')
const route = useRoute()

const room = computed(() => roomStore.data)

onMounted(() => {
  setInterval(() => {
    if (room.value.status === 'playing' && room.value.start_at) {
      const to = room.value.end_at ? room.value.end_at : new Date().getTime()
      count_down.value = countDownTimer(room.value.start_at, to)
    } else {
      count_down.value = "00:00"
    }
  }, 1000)
})

const toggleFlag = () => {
  roomStore.setting({
    ...roomStore.options,
    is_flagging: !roomStore.options.is_flagging
  })
}
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
          @click="roomStore.makeGame(true)"
        >
          <span class="uppercase">New <span class="hidden md:inline-flex">Game</span></span>
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
        <div>{{ room.width }}x{{ room.height }}</div>
      </div>
      <div
        v-if="roomStore.isEnded"
        class="border p-1.5 h-full rounded flex gap-3 items-center text-gray-400"
      >
        <div
          class="cursor-pointer"
          :class="{'text-blue-500': room.status !== 'replaying'}"
          @click="roomStore.replay()"
        >
          <div class="i-icons-replay w-4 h-4"/>
        </div>
        <div
          class="cursor-pointer"
          :class="{'text-blue-500': room.status === 'replaying'}"
          @click="roomStore.stopPlay()"
        >
          <div class="i-icons-stop w-5 h-5"/>
        </div>
      </div>
      <template v-else>
        <div class="shadow-inner p-2 rounded flex gap-2 items-center">
          <div class="i-icons-bomb w-5 h-5"/>
          <div>{{ room.num_bomb - roomStore.bombOpened }}</div>
        </div>
      </template>
      <div
        v-if="!roomStore.isEnded"
        class="p-2 rounded flex gap-2 items-center cursor-pointer duration-300"
        :class="roomStore.options.is_flagging ? 'shadow-inner bg-green-100': 'shadow hover:shadow-lg duration-200 bg-white text-neutral-800'"
        @click="toggleFlag()"
      >
        <div class="i-icons-flag w-5 h-5"/>
      </div>
    </div>
  </div>
</template>
