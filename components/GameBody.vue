<template>
  <div class="relative p-1.5 md:p-2 bg-[#bbada0] shadow-lg md:rounded">
    <div
      class="overflow-hidden"
      :class="{
        'p-1 -m-1': room.width < 16,
        'p-0.25 -m-0.25': room.width >= 16 && room.width < 24,
        'p-0.125 -m-0.125': room.width >= 16,
        'grayscale': roomStore.currentPlayer?.status.startsWith('hold_') ||  roomStore.isEnded
      }"
    >
      <div class="flex h-full font-bold font-proto-mono">
        <div
          v-for="x in room.width"
          class="flex flex-col flex-auto"
          :class="{
            'p-1 -m-1': room.width < 16,
            'p-0.25 -m-0.25': room.width >= 16 && room.width < 24,
            'p-0.125 -m-0.125': room.width >= 16
          }"
        >
          <div v-for="y in room.height" class="flex-auto md:min-w-auto md:min-h-auto min-w-1/12">
            <div
              class="pt-full relative"
              @click="roomStore.play( x - 1, y - 1)"
              @contextmenu="roomStore.play(x - 1, y - 1, false, $event)"
            >
              <div
                class="cell"
                :class="{
                  'inset-0.5':  room.width < 16,
                  'inset-0.25 text-xs': room.width >= 16 && room.width < 24,
                  'inset-0.125 text-2xs': room.width >= 24,
                  '!bg-[#ccc1b4] shadow': typeof room.results[`${x - 1}_${y - 1}`] === 'undefined' && room.status !== 'dead',
                  'bg-[#bbada0]': room.results[`${x - 1}_${y - 1}`] === 0 || (typeof room.results[`${x - 1}_${y - 1}`] === 'undefined' && room.status === 'dead'),
                  'bg-[#eee4da] shadow-inner': room.results[`${x - 1}_${y - 1}`] === 1,
                  'bg-[#eee1c9] shadow-inner': room.results[`${x - 1}_${y - 1}`] === 2,
                  'bg-[#f3b27a] text-white shadow-inner': room.results[`${x - 1}_${y - 1}`] === 3,
                  'bg-[#f69664] text-white shadow-inner': room.results[`${x - 1}_${y - 1}`] === 4,
                  'bg-[#f77c5f] text-white shadow-inner': room.results[`${x - 1}_${y - 1}`] === 5,
                  'bg-[#f75f3b] text-white shadow-inner': room.results[`${x - 1}_${y - 1}`] === 6,
                  'bg-gray-100 shadow':  room.results[`${x - 1}_${y - 1}`] === null,
                  'bg-[#f75f3b] text-white shadow':  room.results[`${x - 1}_${y - 1}`] === -1,
                }"
              >
                <div
                  v-if="room.results[`${x - 1}_${y - 1}`] === -1"
                  class="i-icons-bomb"
                  :class="{'w-2 h-2': room.width >= 16, 'w-4 h-4': room.width < 16}"
                ></div>
                <div
                  v-else-if="room.results[`${x - 1}_${y - 1}`] === null"
                  class="i-icons-flag"
                  :class="{'w-2 h-2': room.width >= 16, 'w-4 h-4': room.width < 16}"
                ></div>
                <span
                  v-else-if="room.results[`${x - 1}_${y - 1}`]"
                  :class="{'text-2xs': room.width >= 16}"
                >{{ room.results[`${x - 1}_${y - 1}`] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition
      enter-active-class="animated animated-faster animated-fade-in"
      leave-active-class="animated animated-faster animated-fade-out"
    >
      <div v-if="roomStore.currentPlayer?.status.startsWith('hold_')" class="absolute inset-0 p-6">
        <div
          class="md:max-w-4/5 mx-auto w-full bg-white p-4 rounded shadow h-full max-h-[512px] flex flex-col space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 i-icons-bomb"/>
            <div class="font-bold uppercase">Boom</div>
          </div>
          <div class="flex-1 flex flex-col gap-4">
            <p class="text-xs md:text-sm">You got a bomb, by choosing continue, you will respawn and get a ticket to
              check this bomb get jackpot!</p>
            <div class="flex-1 space-y-3 text-center flex flex-col justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/536/536050.png" alt=""
                class="hidden md:block w-16 md:w-24 mx-auto"
              >
              <div class="text-2xl md:text-4xl font-extrabold flex gap-2 items-center justify-center">
                <span>{{ (lottery || 0).toLocaleString() }}</span>
              </div>
              <span class="text-xs uppercase font-bold">In prize!</span>
            </div>
          </div>
          <div class="text-center font-bold">
            <div
              class="mx-auto text-center p-3 py-1.5 shadow-lg rounded justify-center inline-flex gap-2 items-center cursor-pointer"
              :class="{
                'text-gray-100 bg-gray-300 cursor-not-allowed	': userStore.balance < respawnCost,
                'bg-neutral-800 text-orange-500': userStore.balance >= respawnCost
              }"
              @click="roomStore.purchase(true)"
            >
              <span>Continue</span>
              <img class="w-5 h-5" src="/coin.png" alt="Coin"/>
              <span>{{ respawnCost}}</span>
            </div>
            <a
              v-if="userStore.balance < respawnCost"
              href="/manager"
              target="_blank"
              class="mt-2 flex gap-1 text-sm text-orange-500 cursor-pointer justify-center"
            >
              <b>Balance not enough!</b>
            </a>
            <div
              class="text-center cursor-pointer p-4 py-2 text-sm underline"
              @click="roomStore.purchase(false)"
            >End Game
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition
      enter-active-class="animated animated-faster animated-fade-in"
      leave-active-class="animated animated-faster animated-fade-out"
    >
      <div
        v-show="roomStore.isEnded"
        class="bg-black/30 rounded absolute inset-0 flex flex-col items-center justify-center space-y-4"
      >
        <div class="text-center">
          <div v-show="roomStore.data.status === 'won'" class="my-6" id="confetti">
            <img class="mx-auto w-32 h-32" src="/confetti.gif" alt="">
          </div>
          <div v-show="roomStore.data.status === 'dead'" class="my-6">
            <img class="mx-auto w-32 h-32" src="/nuclear.png" alt="">
          </div>
          <div class="text-3xl font-extrabold text-white uppercase">
            <span>{{ roomStore.data.status }}!</span>
          </div>
        </div>
        <div class="flex justify-center gap-3">
          <div
            class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
            @click="roomStore.changeStatus('review')"
          >
            <span class="uppercase text-xs font-bold">Review</span>
          </div>
          <div
            class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
            @click="roomStore.makeGame()"
          >
            <div class="i-icons-smile w-4 h-4"/>
            <span class="uppercase text-xs font-bold">Endgame</span>
          </div>
          <div
            v-if="room.turns.length > 5 && false"
            class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
            @click="roomStore.replay()"
          >
            <div class="i-icons-play w-4 h-4"/>
            <span class="uppercase text-xs font-bold">Replay</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <div class="flex justify-center">
    <a class="p-1 text-xs uppercase font-bold shadow px-3 rounded bg-amber-2" target="_blank" href="/how-to-play">
      <span>How to play?</span>
    </a>
  </div>
</template>

<script lang="ts" setup>
import type {ILottery} from "~/interface";
import {useRoomStore} from "~/stores/room";
import {useGlobalStore} from "~/stores/global";
import {useUserStore} from "~/stores/user";

const roomStore = useRoomStore()
const globalStore = useGlobalStore()
const room = computed(() => roomStore.data)
const userStore = useUserStore()
const [{data: lottery}, {data: potentialEarn}] = await Promise.all([
  useAuthFetch<ILottery>('/gms/lottery', {
    watch: [() => roomStore.data.status],
    server: false
  }),
  useAuthFetch<number>('/gms/potential-earn', {
    params: {
      width: roomStore.data.width,
      height: roomStore.data.height,
      num_bomb: roomStore.data.num_bomb
    },
    server: false
  })
])

const respawnCost = computed(() => {
  return (roomStore.data.is_multiplayer ? roomStore.data.ticket : potentialEarn.value || 0) / 2
})
</script>

