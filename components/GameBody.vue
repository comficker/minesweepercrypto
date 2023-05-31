<template>
  <div class="relative p-1.5 md:p-2 bg-[#bbada0] shadow-lg rounded">
    <div
      class="overflow-hidden"
      :class="{
          'p-1 -m-1': gs.width < 16,
          'p-0.5 -m-0.5': gs.width >= 16 && gs.width < 24,
          'p-0.25 -m-0.25': gs.width >= 16,
          'grayscale': gs.playStatus.startsWith('hold_') ||  gs.ending
        }"
    >
      <div class="flex h-full font-bold font-proto-mono">
        <div
          v-for="x in gs.width"
          class="flex flex-col flex-auto"
          :class="{
              'p-1 -m-1': gs.width < 16,
              'p-0.5 -m-0.5': gs.width >= 16 && gs.width < 24,
              'p-0.25 -m-0.25': gs.width >= 16
            }"
        >
          <div v-for="y in gs.height" class="flex-auto md:min-w-auto md:min-h-auto min-w-1/12">
            <div
              class="pt-full relative"
              @click="gs.play(null, x - 1, y - 1)"
              @contextmenu="gs.play($event, x - 1, y - 1)"
            >
              <div
                class="cell"
                :class="{
                    'inset-0.5':  gs.width < 16,
                    'md:inset-0.5 inset-0.25 text-xs': gs.width >= 16 && gs.width < 24,
                    'inset-0.25 text-2xs': gs.width >= 24,
                    '!bg-[#ccc1b4] shadow': typeof gs.results[`${x - 1}_${y - 1}`] === 'undefined' && gs.status !== 'dead',
                    'bg-[#bbada0]': gs.results[`${x - 1}_${y - 1}`] === 0 || (typeof gs.results[`${x - 1}_${y - 1}`] === 'undefined' && gs.status === 'dead'),
                    'bg-[#eee4da] shadow-inner': gs.results[`${x - 1}_${y - 1}`] === 1,
                    'bg-[#eee1c9] shadow-inner': gs.results[`${x - 1}_${y - 1}`] === 2,
                    'bg-[#f3b27a] text-white shadow-inner': gs.results[`${x - 1}_${y - 1}`] === 3,
                    'bg-[#f69664] text-white shadow-inner': gs.results[`${x - 1}_${y - 1}`] === 4,
                    'bg-[#f77c5f] text-white shadow-inner': gs.results[`${x - 1}_${y - 1}`] === 5,
                    'bg-[#f75f3b] text-white shadow-inner': gs.results[`${x - 1}_${y - 1}`] === 6,
                    'bg-gray-100 shadow':  gs.results[`${x - 1}_${y - 1}`] === null,
                    'bg-[#f75f3b] text-white shadow':  gs.results[`${x - 1}_${y - 1}`] === -1,
                  }"
              >
                <div
                  v-if="gs.results[`${x - 1}_${y - 1}`] === -1"
                  class="i-icons-bomb"
                  :class="{'w-2 h-2': gs.width >= 16, 'w-4 h-4': gs.width < 16}"
                ></div>
                <div
                  v-else-if="gs.results[`${x - 1}_${y - 1}`] === null"
                  class="i-icons-flag w-4 h-4"
                ></div>
                <span v-else-if="gs.results[`${x - 1}_${y - 1}`]">{{ gs.results[`${x - 1}_${y - 1}`] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transition
      enter-active-class="animated animated-faster animated-fade-in"
      leave-active-class="animated animated-faster animated-fade-out-down"
    >
      <div v-if="gs.playStatus.startsWith('hold_')" class="absolute inset-0 p-6">
        <div
          class="md:max-w-2/3 mx-auto w-full bg-white p-4 rounded shadow h-full max-h-[512px] flex flex-col space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 i-icons-bomb"/>
            <div class="font-bold uppercase">Boom</div>
          </div>
          <div class="flex-1 flex flex-col gap-4">
            <p class="text-xs md:text-sm">You got a bomb, by choosing continue, you will respawn and get a ticket to
              check this bomb, if was golden bomb
              you will get jackpot</p>
            <div class="flex-1 space-y-3 text-center flex flex-col justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/536/536050.png" alt=""
                class="hidden md:block w-16 md:w-32 mx-auto"
              >
              <div class="text-3xl md:text-5xl font-extrabold flex gap-2 items-center justify-center">
                <span>{{ lottery.prize?.toLocaleString() }}</span>
              </div>
              <span class="text-xs uppercase font-bold">In prize!</span>
            </div>
          </div>
          <div class="text-center space-y-2 font-bold">
            <div
              class="mx-auto text-center p-4 py-2 shadow-lg rounded justify-center inline-flex gap-2 items-center bg-neutral-800 text-orange-500 cursor-pointer"
              @click="gs.purchase(true)"
            >
              <span>Continue</span>
              <span>10</span>
              <img class="w-5 h-5" src="/coin.png" alt="Coin"/>
            </div>
            <div
              class="text-center cursor-pointer p-4 py-2"
              @click="gs.purchase(false)"
            >End Game
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition
      enter-active-class="animated animated-faster animated-fade-in"
      leave-active-class="animated animated-faster animated-fade-out-down"
    >
      <div
        v-show="gs.ending"
        class="bg-black/30 rounded absolute inset-0 flex flex-col items-center justify-center space-y-4"
      >
        <div class="text-center">
          <div v-show="gs.status === 'win'" class="my-6" id="confetti">
            <img class="mx-auto w-32 h-32" src="/confetti.gif" alt="">
          </div>
          <div v-show="gs.status === 'dead'" class="my-6">
            <img class="mx-auto w-32 h-32" src="/nuclear.png" alt="">
          </div>
          <div class="text-3xl font-extrabold text-white">
            <span v-if="gs.status === 'win'">WON!</span>
            <span v-else>DEAD</span>
          </div>
        </div>
        <div class="flex justify-center gap-3">
          <div
            class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
            @click="gs.ending = false"
          >
            <div class="i-icons-smile w-4 h-4"/>
            <span class="uppercase text-xs font-bold">Endgame</span>
          </div>
          <div
            v-if="gs.steps.length > 5"
            class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
            @click="gs.replay()"
          >
            <div class="i-icons-play w-4 h-4"/>
            <span class="uppercase text-xs font-bold">Replay</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import {useGameStore} from "~/composables/game";
import {ILottery} from "~/interface";
import {ref, watch} from "vue";

const gs = useGameStore()

const lottery = ref<ILottery>({} as ILottery)

const fetchLottery = async () => {
  const {data: res} = await useAuthFetch<ILottery>('/minesweeper/lottery')
  if (res.value) lottery.value = res.value as ILottery
}

watch(() => gs.playStatus, (n: string, o) => {
  if (n.startsWith("hold_")) {
    fetchLottery()
  }
})

onMounted(() => {
  if (gs.playStatus.startsWith("hold_")) {
    fetchLottery()
  }
})
</script>

<style scoped>

</style>
