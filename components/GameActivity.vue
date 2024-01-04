<script setup lang="ts">
import {IUserGame, ResponseUserGames} from "~/interface";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {computed, ref} from "vue";
import {useUserStore} from "~/stores/user";
import {useGameStore} from "~/stores/game";
import {countDownTimer, timeSince} from "~/helpers";
import InviteForm from "~/components/InviteForm.vue";

const userStore = useUserStore()
const gs = useGameStore()
const logged = computed(() => {
  return userStore.logged
})

const mode = ref('History')
const page = ref(1)

const params = computed(() => {
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
  return params
})

const {data: response} = await useAuthFetch<ResponseUserGames>('/minesweeper/user-games/', {
  params: params,
  watch: [params],
  immediate: true
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
</script>

<template>
  <div v-if="!userStore.isLogged" class="h-full flex flex-col justify-center items-center p-3 border rounded">
    <div class="font-bold uppercase">Join!</div>
    <p><span class="underline cursor-pointer" @click="userStore.setModal('login')">Login</span> or
      <span class="underline cursor-pointer" @click="userStore.setModal('register')">register</span> to play with your friend</p>
  </div>
  <div v-else-if="gs.players.length" class="md:rounded md:border overflow-hidden w-full bg-white md:px-3 pt-2 pb-2 text-sm">
    <table class="min-w-full table-fixed overflow-auto">
      <thead>
      <tr role="rowheader" class="font-semibold text-right">
        <th role="columnheader" class="px-2 pl-2 pr-2 sm:pl-0 text-left">Players</th>
        <th role="columnheader" class="w-32 px-2 py-1.5">Time</th>
        <th role="columnheader" class="w-32 px-2 py-1.5">Score</th>
      </tr>
      </thead>
      <tbody class="whitespace-nowrap font-bold">
      <tr role="row" v-for="(item, i) in gs.players" :key="i" class="rounded text-right">
        <td class="px-2 py-2 text-left">{{ item.user.username }}</td>
        <td class="px-2 py-2" :class="item.status === 'win' ? 'text-blue-500': 'text-red-500'">0</td>
        <td class="px-2 py-2">{{ item.score || 0 }}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <invite-form v-else :show-history="false"/>
</template>
