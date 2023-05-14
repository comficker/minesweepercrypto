<template>
  <div class="space-y-3">
    <div class="flex gap-4 text-xs font-bold justify-between">
      <div class="md:w-1/3 flex items-center gap-3">
        <div class="flex items-center">
          <div
            class="p-2 rounded flex gap-2 items-center cursor-pointer duration-300"
            :class="{'shadow hover:shadow-lg duration-200 bg-white text-neutral-800': !isFlagging}"
            @click="isFlagging = !isFlagging"
          >
            <div class="i-icons-flag w-5 h-5"/>
          </div>
        </div>
      </div>
      <div class="w-1/3 flex items-center gap-3 justify-center">
        <div
          class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
          @click="handleNewGame"
        >
          <div class="i-icons-dead w-5 h-5"/>
          <span class="uppercase hidden md:block">Reset</span>
        </div>
      </div>
      <div class="w-1/3 flex items-center gap-3 justify-end">
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
    <div class="relative p-2 bg-white shadow rounded">
      <div
        class="overflow-auto md:overflow-visible"
        :class="{
          'p-1 -m-1': size.width < 16,
          'p-0.5 -m-0.5': size.width >= 16 && size.width < 24,
          'p-0.25 -m-0.25': size.width >= 16,
          'grayscale blur-sm': isPending || isWon
        }"
      >
        <div class="flex flex-col h-full font-bold">
          <div
            v-for="x in size.width"
            class="flex flex-auto"
            :class="{
              'p-1 -m-1': size.width < 16,
              'p-0.5 -m-0.5': size.width >= 16 && size.width < 24,
              'p-0.25 -m-0.25': size.width >= 16
            }"
          >
            <div v-for="y in size.height" class="flex-auto md:min-w-auto md:min-h-auto min-w-1/12 min-h-1/12">
              <div class="pt-full relative" @click="onClick(x - 1, y - 1)">
                <div
                  class="rounded-sm absolute flex items-center justify-center text-black"
                  :class="{
                    'inset-0.5': size.width < 16,
                    'inset-0.25 text-xs': size.width >= 16 && size.width < 24,
                    'inset-0.25 text-2xs': size.width >= 24,
                    'bg-green-600': typeof results[`${x - 1}_${y - 1}`] === 'undefined' && !isDead,
                    'bg-[#faf8ef]': results[`${x - 1}_${y - 1}`] === 0 || typeof results[`${x - 1}_${y - 1}`] === 'undefined',
                    'bg-green-100': results[`${x - 1}_${y - 1}`] === 1,
                    'bg-green-200': results[`${x - 1}_${y - 1}`] === 2,
                    'bg-green-300': results[`${x - 1}_${y - 1}`] === 3,
                    'bg-green-400': results[`${x - 1}_${y - 1}`] === 4,
                    'bg-green-500': results[`${x - 1}_${y - 1}`] === 5,
                    'bg-gray-100':  results[`${x - 1}_${y - 1}`] === null,
                    'bg-red-300':  results[`${x - 1}_${y - 1}`] === -1
                  }"
                >
                  <div
                    v-if="results[`${x - 1}_${y - 1}`] === -1"
                    class="i-icons-bomb w-4 h-4"
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
        <div v-if="isPending" class="absolute inset-0 p-6">
          <div class="md:max-w-2/3 mx-auto w-full bg-white p-4 rounded shadow h-full flex flex-col space-y-3">
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
                class="text-center p-4 py-2 shadow-lg rounded justify-center flex gap-2 items-center bg-neutral-800 text-orange-500 cursor-pointer"
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
      <div v-show="isWon" class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <div class="-space-y-16 text-center">
          <div class="w-64 h-64" id="confetti"></div>
          <div class="text-3xl font-bold text-shine">You won!</div>
        </div>
        <div
          class="bg-white text-neutral-80 shadow hover:shadow-lg duration-200 p-2 md:px-4 rounded flex gap-2 items-center cursor-pointer"
          @click="handleNewGame"
        >
          <div class="i-icons-smile w-4 h-4"/>
          <span class="uppercase text-xs font-bold">Continue</span>
        </div>
      </div>
    </div>
    <p v-if="false" class="text-xs text-gray-400 hover:text-neutral-800 duration-200 italic">Hint: Use the numbers
      revealed in step 1
      to deduce where the mines might be located. For example, if a square shows the number 2, it means that two of the
      eight squares surrounding that square contain mines.</p>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue"
import {useUserStore} from "~/composables/user";
import {useGlobalStore} from "~/composables/global";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {onMounted} from "@vue/runtime-core";
import {countDownTimer} from "~/helpers";
import {ILottery} from "~/interface";
import lottie from 'lottie-web';
import confetti from "~/constants/confetti.json"

const userStore = useUserStore()
const globalStore = useGlobalStore()

const size = computed(() => globalStore.setting.size)
const confettiAni = ref<any>(null)
const maps: any = ref({})
const results: any = ref({})
const isDead = ref(false)
const isFlagging = ref(false)
const isPending = ref<any>(null)
const isWon = ref(false)
const startAt = ref<number>((new Date()).getTime())
const countDown = ref("00:00")
const lottery = ref<ILottery>({} as ILottery)

const isLogged = computed(() => {
  return userStore.isLogged
})

const totalBomb = computed(() => {
  return Math.floor(Math.sqrt(Math.pow(size.value.width, 2) + Math.pow(size.value.height, 2)))
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
  isPending.value = false
  isWon.value = false
  if (isLogged.value) {
    handlePlayServer(-1, -1, false)
  } else {
    results.value = {}
    maps.value = {}
    isDead.value = false
  }
}

const handlePlayLocal = (cord: string, clicked: string[] = []) => {
  if (Object.keys(maps.value).length === 0) {
    drawMapLocal(cord)
    startAt.value = (new Date()).getTime()
  }
  if (isFlagging.value) {
    if (typeof results.value[cord] === 'undefined') {
      results.value[cord] = null
    } else {
      delete results.value[cord]
    }
    return;
  } else if (results.value[cord] === null) {
    return;
  }
  const checked = maps.value[cord]
  results.value[cord] = checked
  if (checked === -1) {
    isDead.value = true
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
        nb[0] >= 0 && nb[1] >= 0 &&
        nb[0] < size.value.width && nb[1] < size.value.height &&
        !clicked.includes(key)) {
        handlePlayLocal(key, clicked)
      }
    })
  }
  const opened = Object.values(results.value).filter(x => x !== null).length
  if (size.value.width * size.value.height - opened === totalBomb.value) {
    isWon.value = true
  }
}

const handlePlayServer = async (x: number | undefined, y: number | undefined, isPurchased = false): Promise<string | null> => {
  if (!isLogged.value) return null
  const {data: res, pending, execute} = await useAuthFetch(`/minesweeper/play`, {
    method: 'POST',
    body: {
      x, y,
      is_purchased: isPurchased,
      is_flag: isFlagging.value,
      width: size.value.width,
      height: size.value.height
    },
    server: false
  })
  if (pending.value) {
    await execute()
  }
  const value = res.value as any
  if (value) {
    if (value.status.startsWith("hold_")) {
      const temp = value.status.split("_")
      isPending.value = {
        x: Number.parseInt(temp[1]),
        y: Number.parseInt(temp[2])
      }
    }
    results.value = value.results || {}
    isDead.value = value.status === "dead"
    isWon.value = value.status === "won"
    startAt.value = (new Date(value.start_at)).getTime()
    if (value.height !== size.value.height || value.width !== size.value.width) {
      globalStore.setSetting({
        size: {
          width: value.width,
          height: value.height
        }
      })
    }
    return value.status
  }
  return null
}

const purchase = async (isPurchased = false) => {
  if (isPending.value) {
    const status = await handlePlayServer(isPending.value.x, isPending.value.y, isPurchased)
    if (status && status?.startsWith("hold_")) {

    } else {
      isPending.value = false
    }
  }
}

const onClick = (x: number, y: number) => {
  if (isLogged.value) {
    handlePlayServer(x, y)
  } else {
    handlePlayLocal(`${x}_${y}`, [])
  }
}

const fetchLottery = async () => {
  const {data: res} = await useAuthFetch<ILottery>('/minesweeper/lottery')
  if (res.value) lottery.value = res.value
}

const openSetting = () => {
  userStore.setModal('setting')
}

watch(isLogged, () => {
  handlePlayServer(undefined, undefined, false)
})

watch(isPending, (n, o) => {
  if (n) {
    fetchLottery()
  }
})

watch(size, (n) => {
  handlePlayServer(-1, -1, false)
})

onMounted(() => {
  handlePlayServer(undefined, undefined, false)

  setInterval(() => {
    if (!isDead.value && !isWon.value && startAt.value) {
      countDown.value = countDownTimer(startAt.value, (new Date()).getTime())
    }
  }, 1000)
  if (document.getElementById('confetti')) {
    confettiAni.value = lottie.loadAnimation({
      container: document.getElementById('confetti'),
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: confetti,
      rendererSettings: {}
    })
    confettiAni.value.play()
  }
})
</script>

<style>
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
</style>