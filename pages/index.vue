<template>
  <div class="w-full max-w-xl mx-auto space-y-4">
    <Game/>
    <div class="rounded overflow-hidden w-full  divide-y" :class="{'shadow bg-white': !logged.id}">
      <div v-if="!logged.id" class="flex p-4">
        <div class="flex-1 flex flex-col space-y-3">
          <h2 class="text-2xl font-semibold uppercase font-proto-mono">Join to play and earn</h2>
          <div>
            <div
              class="rounded p-2 shadow cursor-pointer bg-neutral-800 text-orange-500 cursor-pointer inline-flex gap-2"
              @click="userStore.setModal('login')"
            >
              <div class="i-icons-account w-4 h-4"/>
              <span class="text-xs uppercase font-bold">Become member</span>
            </div>
          </div>
        </div>
        <div class="w-1/4">
          <img src="/jumbotron-bomb.png" alt="">
        </div>
      </div>
      <div class="flex justify-center gap-2 md:gap-3 text-white flex-wrap grayscale" :class="{'p-3': !logged.id}">
        <div id="market-apple" class="flex gap-2 items-center bg-gray-900 rounded p-2">
          <img class="w-6" src="/market/apple-logo.png" alt="">
          <div class="text-xs">
            <div class="hidden md:block text-gray-400">Available on</div>
            <div class="uppercase font-bold">IOS</div>
          </div>
        </div>
        <div id="market-google" class="flex gap-2 items-center bg-gray-900 rounded p-2">
          <img class="w-6" src="/market/google-play-logo.png" alt="">
          <div class="text-xs">
            <div class="hidden md:block text-gray-400">Available on</div>
            <div class="uppercase font-bold">Android</div>
          </div>
        </div>
        <div id="market-telegram" class="flex gap-2 items-center bg-gray-900 rounded p-2">
          <img class="w-6" src="/market/telegram.png" alt="">
          <div class="text-xs">
            <div class="hidden md:block text-gray-400">Play on</div>
            <div class="uppercase font-bold">Telegram</div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <div class="flex items-center gap-3 text-sm font-bold">
        <div
          v-for="item in ['Activity', 'History', 'Leaderboard']"
          class="cursor-pointer p-2 rounded flex gap-2 items-center"
          :class="{
            'bg-white text-neutral-80 shadow hover:shadow-lg duration-200': mode === item,
            'shadow-inner': mode !== item
          }"
          @click="mode = item"
        >
          <div class="i-icons-history w-4 h-4"/>
          <div>{{ item }}</div>
        </div>
      </div>
      <div id="activity" class="rounded shadow overflow-hidden w-full bg-white px-3 pb-2">
        <div class="flow-root text-sm">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <client-only>
                <table class="min-w-full table-fixed overflow-auto">
                  <thead>
                  <tr role="rowheader" class="font-semibold text-right">
                    <th role="columnheader" class="px-2 pl-2 pr-2 sm:pl-0 text-left">User</th>
                    <th role="columnheader" class="w-32 px-2 py-1.5">Time</th>
                    <th role="columnheader" class="w-32 px-2 py-1.5">Level</th>
                    <th role="columnheader" class="w-32 px-2 py-1.5">Date</th>
                  </tr>
                  </thead>
                  <tbody class="whitespace-nowrap font-bold">
                  <tr role="row" v-for="(item, i) in items" :key="i" class="rounded text-right">
                    <td class="px-2 py-2 text-left">{{ item.user.username }}</td>
                    <td class="px-2 py-2" :class="{
                    'text-blue-500': item.status === 'win',
                    'text-red-500': item.status === 'dead'
                  }">{{ item.time }}</td>
                    <td class="px-2 py-2">{{ item.level }}</td>
                    <td class="px-2 py-2">{{ item.since }}</td>
                  </tr>
                  </tbody>
                </table>
              </client-only>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-3 text-sm">
      <h2 class="text-2xl font-bold">How to play Minesweeper?</h2>
      <p class="font-bold">Minesweeper is a classic strategy game where players must uncover hidden mines on a grid
        without detonating them. Here are the basic steps to play minesweeper:</p>
      <ul class="list-decimal pl-8 space-y-2">
        <li>Start by clicking on any square on the board. This will reveal a number indicating how many mines are
          touching that square.
        </li>
        <li>Use the numbers revealed in step 1 to deduce where the mines might be located. For example, if a square
          shows the number 2, it means that two of the eight squares surrounding that square contain mines.
        </li>
        <li>Use right-click to place a flag on the squares you think contain mines. This can help you keep track of
          which squares are safe to uncover.
        </li>
        <li>Continue uncovering squares, using the numbers as clues to find the mines. Try to avoid clicking on squares
          you suspect contain mines, as doing so will detonate them and end the game.
        </li>
        <li>If you uncover all the squares that don't contain mines, you win the game. If you detonate a mine, you lose
          the game.
        </li>
      </ul>
      <p class="italic text-sm">Minesweeper can be played with various levels of difficulty, ranging from beginner to
        expert. It's a great game for improving logic and strategic thinking skills, and can be a lot of fun once you
        get the hang of it.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useSeoMeta, useRoute} from "nuxt/app";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {ResponseGames, IGame} from "~/interface";
import {useUserStore} from "~/composables/user";
import {countDownTimer, timeSince} from "~/helpers";
import Game from "~/components/Game.vue";
import {computed, ref, watch} from "vue";
import {onMounted} from "@vue/runtime-core";

const title = "Minesweeper Battle | Minesweeper Online | MinesweeperCrypto | minesweeperbattle.com"
const desc = 'Minesweeper is a classic strategy game where players must uncover hidden mines on a grid without detonating them.'
useSeoMeta({
  applicationName: 'Minesweeper Battle',
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogImage: '/screenshot/color-guessing-game.png',
  twitterCard: 'summary_large_image',
})

const isActivityAppear = ref(false)
const userStore = useUserStore()
const mode = ref('Activity')
const response = ref<ResponseGames>({} as ResponseGames)

const logged = computed(() => {
  return userStore.logged
})
const items = computed(() => {
  return response.value && response.value.results ? response.value.results.map((x: IGame) => {
    return {
      ...x,
      level: `${x.width}x${x.height}`,
      time: x.end_at ? countDownTimer((new Date(x.start_at)).getTime(), (new Date(x.end_at)).getTime()) : '_',
      since: timeSince(x.start_at)
    }
  }) : []
})

const fetch = async function () {
  const params: any = {}
  if (mode.value === 'History' && logged.value && logged.value.id) {
    params['user__id'] = logged.value.id
  }
  if (mode.value === 'Leaderboard') {
    params['ordering'] = '-score'
    params['status'] = 'win'
  }
  const {data: res, pending, execute} = await useAuthFetch<ResponseGames>('/minesweeper/games/', {
    params: params
  })
  if (pending.value) {
    await execute()
  }
  if (res.value) response.value = res.value;
}

const checkActivityAppear = () => {
  const elm = document.getElementById('activity')
  if (elm) {
    const rect = elm.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  return false
}

watch(mode, () => {
  fetch()
})

onMounted(() => {
  if (checkActivityAppear()) {
    isActivityAppear.value = true
    fetch()
  }

  window.onscroll = () => {
    if (checkActivityAppear()) {
      if (!isActivityAppear.value) {
        isActivityAppear.value = true
        fetch()
      }
    }
  }
})
</script>

<style scoped>
table {
  border-spacing: 0 4px;
  border-collapse: separate;
}

tr.rounded {
  z-index: 1;
  position: relative;
}

tr.rounded td:first-child:before {
  @apply absolute inset-0 rounded box-content;
  content: "";
  z-index: -1;
  background-color: #faf8ef;
}
</style>
