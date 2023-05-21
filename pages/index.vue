<template>
  <div class="w-full max-w-xl mx-auto space-y-4">
    <Game/>
    <div v-if="!isTelegram" class="rounded overflow-hidden w-full  divide-y" :class="{'shadow bg-white': !logged.id}">
      <div v-if="!logged.id" class="flex p-4 pb-0">
        <div class="flex-1 flex flex-col space-y-2">
          <h2 class="text-lg leading-6 sm:text-2xl font-bold uppercase font-proto-mono">Join to play and earn</h2>
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
        <div>
          <img class="w-24 h-24" width="128px" src="/flag.png" alt="Flag">
        </div>
      </div>
    </div>
    <invite-form v-if="logged.id" :show-history="false"/>
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
                    <td class="px-2 py-2">
                      <nuxt-link class="underline" :to="`/battle/${item.id}`">{{ item.since }}</nuxt-link>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </client-only>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isTelegram" class="rounded shadow overflow-hidden w-full bg-white px-3 py-2 space-y-2 text-sm">
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
import {ResponseGames, IGame} from "~/interface";
import {useUserStore} from "~/composables/user";
import {countDownTimer, timeSince} from "~/helpers";
import Game from "~/components/Game.vue";
import {computed, ref, watch} from "vue";
import {onMounted} from "@vue/runtime-core";
import {useGlobalStore} from "~/composables/global";
import InviteForm from "~/components/InviteForm.vue";

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

const mode = ref('Activity')
const response = ref<ResponseGames>({} as ResponseGames)

const isTelegram = computed(() => globalStore.isTelegram)
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
