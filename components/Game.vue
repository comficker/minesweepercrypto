<template>
  <div class="space-y-3">
    <div class="flex md:grid grid-cols-3 gap-4 text-xs font-bold justify-between">
      <div class="flex items-center gap-3">
        <div
          class="p-2 rounded flex gap-2 items-center cursor-pointer duration-300"
          :class="{
              'shadow hover:shadow-lg duration-200 bg-white text-neutral-800': !isFlagging,
              'shadow-inner bg-green-100': isFlagging
            }"
          @click="isFlagging = !isFlagging"
        >
          <div class="i-icons-flag w-5 h-5"/>
        </div>
      </div>
      <div class="flex justify-center">
        <div
          class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
          @click="handleNewGame"
        >
          <div class="hidden md:block i-icons-dead w-5 h-5"/>
          <span class="uppercase">New Game</span>
        </div>
      </div>
      <div class="md:w-auto w-1/2 flex items-center gap-3 justify-end">
        <div class="shadow-inner p-2 rounded flex gap-2 items-center">
          <div class="i-icons-alarm w-5 h-5"/>
          <div>{{ countDown }}</div>
        </div>
        <div class="shadow-inner p-2 rounded flex gap-2 items-center">
          <div class="i-icons-bomb w-5 h-5"/>
          <div>{{ totalBomb - bombFlagged }}</div>
        </div>
        <div class="rounded-xl p-2 shadow cursor-pointer" @click="openSetting">
          <div class="i-icons-cog w-4 h-4"/>
        </div>
      </div>
    </div>
    <div class="relative p-1.5 md:p-2 bg-[#bbada0] shadow-lg rounded" :style="{'--timeout': `${timeout}s`}">
      <div
        class="overflow-hidden"
        :class="{
          'p-1 -m-1': size.width < 16,
          'p-0.5 -m-0.5': size.width >= 16 && size.width < 24,
          'p-0.25 -m-0.25': size.width >= 16,
          'grayscale blur-sm': gameStatus.startsWith('hold_') || ending
        }"
      >
        <div class="flex h-full font-bold font-proto-mono">
          <div
            v-for="x in size.width"
            class="flex flex-col flex-auto"
            :class="{
              'p-1 -m-1': size.width < 16,
              'p-0.5 -m-0.5': size.width >= 16 && size.width < 24,
              'p-0.25 -m-0.25': size.width >= 16
            }"
          >
            <div v-for="y in size.height" class="flex-auto md:min-w-auto md:min-h-auto min-w-1/12">
              <div
                class="pt-full relative"
                @click="onClick(null,x - 1, y - 1)"
                @contextmenu="onClick($event,x - 1, y - 1)"
              >
                <div
                  class="cell"
                  :class="{
                    'inset-0.5': size.width < 16,
                    'md:inset-0.5 inset-0.25 text-xs': size.width >= 16 && size.width < 24,
                    'inset-0.25 text-2xs': size.width >= 24,
                    '!bg-[#ccc1b4] shadow': typeof results[`${x - 1}_${y - 1}`] === 'undefined' && gameStatus !== 'dead',
                    'bg-[#bbada0]': results[`${x - 1}_${y - 1}`] === 0 || (typeof results[`${x - 1}_${y - 1}`] === 'undefined' && gameStatus === 'dead'),
                    'bg-[#eee4da] shadow-inner': results[`${x - 1}_${y - 1}`] === 1,
                    'bg-[#eee1c9] shadow-inner': results[`${x - 1}_${y - 1}`] === 2,
                    'bg-[#f3b27a] text-white shadow-inner': results[`${x - 1}_${y - 1}`] === 3,
                    'bg-[#f69664] text-white shadow-inner': results[`${x - 1}_${y - 1}`] === 4,
                    'bg-[#f77c5f] text-white shadow-inner': results[`${x - 1}_${y - 1}`] === 5,
                    'bg-[#f75f3b] text-white shadow-inner': results[`${x - 1}_${y - 1}`] === 6,
                    'bg-gray-100 shadow':  results[`${x - 1}_${y - 1}`] === null,
                    'bg-[#f75f3b] text-white shadow':  results[`${x - 1}_${y - 1}`] === -1,
                  }"
                >
                  <div
                    v-if="results[`${x - 1}_${y - 1}`] === -1"
                    class="i-icons-bomb"
                    :class="{'w-2 h-2': size.width >= 16, 'w-4 h-4': size.width < 16}"
                  ></div>
                  <div
                    v-else-if="results[`${x - 1}_${y - 1}`] === null"
                    class="i-icons-flag w-4 h-4"
                  ></div>
                  <span v-else-if="results[`${x - 1}_${y - 1}`]">{{ results[`${x - 1}_${y - 1}`] }}</span>
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
        <div v-if="gameStatus.startsWith('hold_')" class="absolute inset-0 p-6">
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
                @click="purchase(true)"
              >
                <span>Continue</span>
                <span>10</span>
                <img class="w-5 h-5" src="/coin.png" alt="Coin"/>
              </div>
              <div
                class="text-center cursor-pointer p-4 py-2"
                @click="purchase(false)"
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
        <div v-show="ending" class="bg-black/30 rounded absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <div class="text-center" :class="{'-space-y-16': gameStatus === 'win'}">
          <div v-show="gameStatus === 'win'" class="w-64 h-64" id="confetti"></div>
          <div v-show="gameStatus === 'dead'" class="my-6">
            <img class="mx-auto w-32 h-32" src="/nuclear.png" alt="">
          </div>
          <div class="text-3xl font-bold text-shine">
            <span v-if="gameStatus === 'win'">You won!</span>
            <span v-else>You dead</span>
          </div>
        </div>
        <div class="flex justify-center gap-3">
          <div
            class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
            @click="ending = false"
          >
            <div class="i-icons-smile w-4 h-4"/>
            <span class="uppercase text-xs font-bold">Endgame</span>
          </div>
          <div
            v-if="steps.length > 5"
            class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
            @click="replay"
          >
            <div class="i-icons-play w-4 h-4"/>
            <span class="uppercase text-xs font-bold">Replay</span>
          </div>
        </div>
      </div>
      </Transition>
    </div>
    <div class="flex justify-between">
      <nuxt-link class="text-xs uppercase underline font-bold flex items-center gap-1" to="/how-to-play">
        <div class="i-icons-info w-5 h-5"/>
        <span>How to play minesweeper?</span>
      </nuxt-link>
      <div class="flex justify-end gap-4 flex-wrap grayscale">
        <div id="market-apple" class="flex gap-1 items-center">
          <img class="w-4" width="24px" height="24px" src="/market/apple-logo.png" alt="">
          <div class="hidden md:block text-xs">
            <div class="uppercase font-bold">IOS</div>
          </div>
        </div>
        <div id="market-google" class="flex gap-1 items-center">
          <img class="w-4" width="24px" height="24px" src="/market/google-play-logo.png" alt="">
          <div class="hidden md:block text-xs">
            <div class="uppercase font-bold">Android</div>
          </div>
        </div>
        <div id="market-telegram" class="flex gap-1 items-center">
          <img class="w-4" width="24px" height="24px" src="/market/telegram.png" alt="">
          <div class="hidden md:block text-xs">
            <div class="uppercase font-bold">Telegram</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue"
import {useUserStore} from "~/composables/user";
import {useGlobalStore} from "~/composables/global";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {onMounted} from "@vue/runtime-core";
import {countDownTimer} from "~/helpers";
import {ILottery, IStep} from "~/interface";
import lottie from 'lottie-web';
import confetti from "~/constants/confetti.json"

const userStore = useUserStore()
const globalStore = useGlobalStore()

let SOUND_TAP: HTMLAudioElement;
let SOUND_OVER: HTMLAudioElement;

const timeout = ref(10)
const confettiAni = ref<any>(null)
const maps: any = ref({})
const results: any = ref({})
const steps: any = ref<IStep[]>([])
const isFlagging = ref(false)
const gameStatus = ref('playing')
const ending = ref(false)
const startAt = ref<number>((new Date()).getTime())
const countDown = ref("00:00")
const lottery = ref<ILottery>({} as ILottery)
const playQueue = ref<any[]>([])

const enableSound = computed(() => globalStore.setting.soundOn)
const size = computed(() => globalStore.setting.size)
const isLogged = computed(() => {
  return userStore.isLogged
})
const totalBomb = computed(() => {
  return Math.floor(size.value.width * size.value.height * 0.2)
})
const bombFlagged = computed(() => {
  return Object.values(results.value).filter(x => x === -1).length
})

const getNeighbors = (x: number, y: number) => {
  return [[x, y - 1], [x, y + 1], [x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]];
}

const randomCord = (ignoreCord: string): string => {
  const x = Math.floor(Math.random() * size.value.width)
  const y = Math.floor(Math.random() * size.value.height)
  const key = `${x}_${y}`
  if (key !== ignoreCord && maps.value[key] !== -1) {
    maps.value[key] = -1
    return key
  } else {
    return randomCord(ignoreCord)
  }
}

const drawMapLocal = (ignoreCord: string) => {
  while (Object.keys(maps.value).length < totalBomb.value) {
    randomCord(ignoreCord)
  }
  Object.keys(maps.value).forEach((key: string) => {
    const cord = key.split("_")
    const neighbors = getNeighbors(Number.parseInt(cord[0]), Number.parseInt(cord[1]))
    neighbors.forEach((nb: number[]) => {
      if (nb[0] >= 0 && nb[1] >= 0) {
        const nbKey = `${nb[0]}_${nb[1]}`
        if (maps.value[nbKey] !== -1) {
          if (typeof maps.value[nbKey] === "undefined") {
            maps.value[nbKey] = 0
          }
          maps.value[nbKey]++
        }
      }
    })
  })
}

const handleNewGame = () => {
  startAt.value = new Date().getTime()
  gameStatus.value = 'playing'
  steps.value = []
  results.value = {}
  maps.value = {}
  ending.value = false

  playQueue.value.forEach(to => {
    clearTimeout(to)
  })
  if (isLogged.value) {
    handlePlayServer(null, -1, -1, false)
  }
}

const onClick = (e: Event | null, x: number, y: number) => {
  if (gameStatus.value !== 'playing') return;
  if (typeof results.value[`${x}_${y}`] === "number" || (results.value[`${x}_${y}`] === null && !isFlagging.value && !e))
    return;
  if (enableSound.value) SOUND_TAP?.play();
  if (isLogged.value) {
    handlePlayServer(e, x, y)
  } else {
    handlePlayLocal(e, `${x}_${y}`, [])
  }
}

const handlePlayLocal = (e: Event | null, cord: string, clicked: string[] = [], isRecording = true) => {
  if (e) e.preventDefault()
  if (Object.keys(maps.value).length === 0) {
    drawMapLocal(cord)
    startAt.value = (new Date()).getTime()
  }
  if (isFlagging.value || e) {
    if (typeof results.value[cord] === 'undefined') {
      results.value[cord] = null
    } else {
      delete results.value[cord]
    }
    if (isRecording) {
      steps.value.push({
        time: new Date().getTime(),
        cord: cord + '_?',
        user: null
      })
    }
    return;
  } else if (results.value[cord] === null) {
    return;
  }
  if (clicked.length === 0 && isRecording) {
    steps.value.push({
      time: new Date().getTime(),
      cord: cord,
      user: null
    })
  }
  const checked = maps.value[cord]
  results.value[cord] = checked
  if (checked === -1) {
    gameStatus.value = 'dead'
    results.value = maps.value
  }
  if (typeof maps.value[cord] === "undefined") {
    clicked.push(cord)
    results.value[cord] = 0
    const nbCord = cord.split("_")
    const neighbors = getNeighbors(Number.parseInt(nbCord[0]), Number.parseInt(nbCord[1]))
    neighbors.forEach((nb: number[]) => {
      const key = `${nb[0]}_${nb[1]}`
      if (
        size.value &&
        nb[0] >= 0 && nb[1] >= 0 &&
        nb[0] < size.value.width && nb[1] < size.value.height &&
        !clicked.includes(key)) {
        handlePlayLocal(null, key, clicked)
      }
    })
  }
  const opened = Object.values(results.value).filter(x => x !== null).length
  if (size.value && size.value.width * size.value.height - opened === totalBomb.value) {
    gameStatus.value = 'win'
  }
}

const handlePlayServer = async (e: Event | null, x: number | undefined, y: number | undefined, isPurchased = false): Promise<string | null> => {
  if (e) e.preventDefault()
  if (!isLogged.value) return null
  const {data: res} = await useAuthFetch(`/minesweeper/play`, {
    method: 'POST',
    body: {
      x, y,
      is_purchased: isPurchased,
      is_flag: isFlagging.value || !!e,
      width: size.value.width,
      height: size.value.height
    },
    server: false
  })
  const value = res.value as any
  if (value) {
    if (value.status) gameStatus.value = value.status;
    if (value.start_at) startAt.value = (new Date(value.start_at)).getTime();
    if (value.height && value.width && (value.height !== size.value?.height || value.width !== size.value?.width)) {
      globalStore.setSetting({
        size: {
          width: value.width,
          height: value.height
        },
      }, false)
    }
    results.value = value.results || {}
    return value.status
  }
  return null
}

const purchase = async (isPurchased = false) => {
  if (gameStatus.value.startsWith("hold_")) {
    const arr = gameStatus.value.split("_")
    const status = await handlePlayServer(null, Number.parseInt(arr[1]), Number.parseInt(arr[2]), isPurchased)
    if (status && status?.startsWith("hold_")) {
      //TODO
    }
  }
}

const fetchLottery = async () => {
  const {data: res} = await useAuthFetch<ILottery>('/minesweeper/lottery')
  if (res.value) lottery.value = res.value
}

const openSetting = () => {
  userStore.setModal('setting')
}

const replay = () => {
  ending.value = false
  gameStatus.value = 'replaying'
  results.value = {}
  playQueue.value.forEach(to => {
    clearTimeout(to)
  })
  playQueue.value = []
  steps.value.forEach((step: IStep, i: number) => {
    playQueue.value.push(setTimeout(() => {
      let cord = step.cord
      isFlagging.value = false
      if (step.cord.endsWith("_?")) {
        isFlagging.value = true
        cord = step.cord.replace("_?", "")
      }
      handlePlayLocal(null, cord, [], false)
      if (i === steps.value.length - 1) {
        ending.value = true
      }
    }, step.time - startAt.value + 1000))
  })
}

watch(isLogged, () => {
  handlePlayServer(null, undefined, undefined, false)
})

watch(gameStatus, (n, o) => {
  if (n.startsWith("hold_")) {
    fetchLottery()
  } else if (n === 'dead') {
    if (n && enableSound.value) SOUND_OVER?.play();
  }
  if (['dead', 'win'].includes(gameStatus.value)) {
    setTimeout(() => {
      ending.value = true
    }, 1000)
  }
})

watch(size, (n, o) => {
  if (n.width !== o.width || n.height !== o.height)
    handlePlayServer(null, -1, -1, false)
})

onMounted(() => {
  handlePlayServer(null, undefined, undefined, false)

  setInterval(() => {
    if (gameStatus.value === 'playing' && startAt.value && !ending.value) {
      countDown.value = countDownTimer(startAt.value, (new Date()).getTime())
    }
  }, 1000)
  if (document.getElementById('confetti')) {
    const elm: HTMLElement | null = document.getElementById('confetti')
    if (elm) {
      confettiAni.value = lottie.loadAnimation({
        container: elm,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: confetti,
        rendererSettings: {}
      })
      confettiAni.value.play()
    }
  }

  SOUND_TAP = new window.Audio("/sound/tap.wav")
  SOUND_OVER = new window.Audio("/sound/over.wav")
})
</script>

<style>
.cell {
  @apply rounded-sm absolute flex items-center justify-center;
}

.cell.shadow {
  box-shadow: rgba(0, 0, 0, 0.16) 0 1px 1px;
}

.cell.shadow-inner {
  box-shadow: inset rgba(0, 0, 0, 0.16) 0 1px 1px;
}

@keyframes rainbow_animation {
  0%, 100% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 0;
  }
}

.text-shine {
  background: linear-gradient(270deg, #ff7356, #ff59e2 25.52%, #52ddf6 50%, #eadf4e 76.04%, #ff7356);
  -webkit-background-clip: text;
  color: transparent;
  animation: rainbow_animation 6s ease-in-out infinite;
  background-size: 400% 100%;
}

.running .squiggle {
  stroke-dasharray: 832;
  stroke-dashoffset: 832;
  animation: draw linear forwards;
  animation-duration: var(--timeout);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
