<template>
  <div class="w-full max-w-xl mx-auto space-y-4">
    <Game/>
    <div v-if="!isTelegram && !logged.id" class="rounded overflow-hidden w-full divide-y shadow bg-white">
      <div class="flex p-4 pb-0">
        <div class="flex-1 flex flex-col space-y-2">
          <h2 class="text-lg leading-6 sm:text-3xl font-bold font-proto-mono">Join to play and earn</h2>
          <div>
            <div
              class="rounded p-2 shadow cursor-pointer bg-neutral-50 cursor-pointer inline-flex gap-2"
              @click="userStore.setModal('login')"
            >
              <div class="i-icons-account w-4 h-4"/>
              <span class="text-xs uppercase font-bold">Become member</span>
            </div>
          </div>
        </div>
        <div>
          <img class="w-24 h-24" width="128" src="/flag.png" alt="Flag">
        </div>
      </div>
    </div>
    <invite-form v-if="logged.id" :show-history="false"/>
    <div class="space-y-2">
      <div class="flex justify-between">
        <div class="flex items-center gap-3 text-sm font-bold">
          <div
            v-for="item in ['Activity', 'History']"
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
        <div class="flex items-center gap-3">
          <div
            class="p-2 rounded"
            :class="{'bg-white cursor-pointer shadow hover:shadow-lg duration-200': !!response.links?.previous}"
            @click="page--"
          >
            <div class="i-icons-left w-4 h-4"/>
          </div>
          <div
            class="p-2 rounded"
            :class="{'bg-white cursor-pointer shadow hover:shadow-lg duration-200': !!response.links?.next}"
            @click="page++"
          >
            <div class="i-icons-right w-4 h-4"/>
          </div>
        </div>
      </div>
      <div
        id="activity"
        class="rounded shadow overflow-hidden w-full bg-white px-3 pb-2 flex"
        :class="{'items-center': items.length === 0}"
      >
        <div class="flow-root text-sm w-full">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full align-middle">
              <table v-if="items.length" class="min-w-full table-fixed overflow-auto">
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
                  <td class="px-2 py-2">
                    <nuxt-link class="underline" :to="`/game/${item.game.id}`">{{ item.since }}</nuxt-link>
                  </td>
                </tr>
                </tbody>
              </table>
              <div v-else-if="!logged.id" class="pt-4 h-full flex flex-col justify-center items-center pb-3">
                <div class="font-bold uppercase">Member's feature!</div>
                <p>You must <span class="underline cursor-pointer" @click="userStore.setModal('login')">login</span> or <span class="underline cursor-pointer" @click="userStore.setModal('register')">register</span> to view your game history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isTelegram" class="rounded shadow overflow-hidden w-full bg-white p-6 space-y-2 text-sm">
      <h2 class="text-2xl font-bold">What is <b class="font-bold">Minesweeper online</b> game?</h2>
      <p>Minesweeper is a classic puzzle game that challenges your logic and reasoning skills. The game is played on a grid filled with hidden mines, and the objective is to uncover all the squares that do not contain mines without detonating any of the hidden explosives.</p>
      <p>Minesweeper requires careful observation and logical deduction to succeed. With different levels of difficulty and endless possibilities, Minesweeper offers a fun and challenging experience for players of all levels. Whether you're an experienced player or a beginner, Minesweeper is a game that never gets old. <nuxt-link class="underline" to="/how-to-play">How to play Minesweeper?</nuxt-link></p>
      <p>Are you ready to put your wits to the test and see if you can uncover all the mines?</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useSeoMeta, useRoute} from "nuxt/app";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {ResponseUserGames, IUserGame} from "~/interface";
import {useUserStore} from "~/composables/user";
import {countDownTimer, timeSince} from "~/helpers";
import Game from "~/components/Game.vue";
import {computed, ref, watch} from "vue";
import {onMounted} from "@vue/runtime-core";
import {useGlobalStore} from "~/composables/global";
import InviteForm from "~/components/InviteForm.vue";
import {useGameStore} from "~/composables/game";

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
const globalStore = useGlobalStore()
const gameStore = useGameStore()
await gameStore.init(undefined)

const mode = ref('Activity')
const response = ref<ResponseUserGames>({} as ResponseUserGames)
const page = ref(1)

const isTelegram = computed(() => globalStore.isTelegram)
const logged = computed(() => {
  return userStore.logged
})
const items = computed<IUserGame[]>(() => {
  return response.value && response.value.results ? response.value.results.map((x: IUserGame) => {
    return {
      ...x,
      level: `${x.game.width}x${x.game.height}`,
      time: x.end_at ? countDownTimer((new Date(x.start_at)).getTime(), (new Date(x.end_at)).getTime()) : '_',
      since: timeSince(x.start_at)
    }
  }) : []
})

const fetch = async function () {
  response.value.results = [] as IUserGame[]
  if (mode.value === 'History' && !logged.value.id) return;
  const params: any = {
    page_size: 6,
    ordering: '-id',
    page: page.value
  }
  if (mode.value === 'History' && logged.value && logged.value.id) {
    params['user__id'] = logged.value.id
  }
  if (mode.value === 'Leaderboard') {
    params['ordering'] = '-score'
    params['status'] = 'win'
  }
  const {data: res} = await useAuthFetch<ResponseUserGames>('/minesweeper/user-games/', {
    params: params
  })
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

watch(page, () => {
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
#activity {
  min-height: 288px;
}
</style>
