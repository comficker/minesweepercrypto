<script setup lang="ts">
import {useAuthFetch} from "~/composables/useAuthFetch";
import {computed, ref} from "vue";
import {useUserStore} from "~/stores/user";
import {countDownTimer, fullName, timeSince} from "~/helpers";
import type {ResponseRoom, Room} from "~/interface/gms";
import {useGlobalStore} from "~/stores/global";
import type {User} from "~/interface";

const route = useRoute()
const userStore = useUserStore()
const globalStore = useGlobalStore()
const logged = computed(() => {
  return userStore.logged
})

const mode = ref('History')
const page = ref(1)

const params = computed(() => {
  const params: any = {
    page_size: 10,
    ordering: '-id',
    page: page.value,
    gms_members__user__username: route.params.username
  }
  return params
})

const [{data: response}, {data: userRes}] = await Promise.all([
  useAuthFetch<ResponseRoom>('/gms/rooms/', {
    params: params,
    watch: [params],
    immediate: true,
    key: "history"
  }),
  useAuthFetch<User>(`/auth/users/${route.params.username}`)
])

const items = computed<Room[]>(() => {
  return response.value && response.value.results ? response.value.results.map((x: Room) => {
    return {
      ...x,
      level: `${x.width}x${x.height}`,
      time: x.end_at && x.start_at ? countDownTimer((new Date(x.start_at)).getTime(), (new Date(x.end_at)).getTime()) : 'Live',
      since: timeSince(x.start_at)
    }
  }) : []
})

const meta = computed(() => {
  const meta = userRes.value?.meta.game_minesweeper || {}
  const won = meta['won'] || 0
  const dead = meta['dead'] || 0
  const total = won + dead
  return {
    score: meta['score'] || 0,
    balance: meta['GMS'] || 0,
    total,
    win_rate: total ? (100 * won / total).toFixed(2) : 0
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="gap-4 flex flex-col justify-center items-center text-center">
      <div class="w-20 h-20 rounded overflow-hidden border p-2">
        <img class="w-full h-full object-cover" src="/avatar.png" alt="">
      </div>
      <div class="space-y-2">
        <h1 class="font-bold text-3xl">{{ fullName(userRes) }}</h1>
        <div class="flex gap-2 text-xs uppercase flex-wrap">
          <div class="flex gap-2">
            <div>Game:</div>
            <div class="font-bold">{{ meta.total }}</div>
          </div>
          <div class="flex gap-2">
            <div>Win rate:</div>
            <div class="font-bold">{{ meta.win_rate }}%</div>
          </div>
          <div class="flex gap-2">
            <div>Score:</div>
            <div class="font-bold">{{ meta.score }}</div>
          </div>
          <div class="flex gap-2">
            <div>Balance:</div>
            <div class="font-bold">{{ meta.balance }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-2 p-3 mx-auto max-w-lg">
      <div class="flex justify-between">
        <div class="flex items-center gap-3 text-sm font-bold">
          <div class="cursor-pointer p-2 rounded flex gap-2 items-center">
            <div class="i-icons-history w-4 h-4"/>
            <div>History</div>
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
      <div class="overflow-hidden w-full bg-white flex" :class="{'items-center': items.length === 0}">
        <div class="flow-root text-sm w-full">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full space-y-3">
              <table v-if="items.length" class="min-w-full table-fixed overflow-auto text-left">
                <thead>
                <tr role="rowheader" class="font-semibold text-gray-500">
                  <th role="columnheader" class="px-2 pl-2 pl-2 text-left">User</th>
                  <th role="columnheader" class="w-32 px-2 py-1.5">Size</th>
                  <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Time</th>
                  <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Date</th>
                </tr>
                </thead>
                <tbody class="whitespace-nowrap font-bold">
                <tr role="row" v-for="(item, i) in items" :key="i" class="rounded border-t-4 border-white">
                  <td class="px-2 py-1 text-left">
                    <div class="flex -space-x-3 mt-1">
                      <div v-for="player in item.gms_members" :key="player.id"
                           class="w-8 h-8 rounded bg-white p-1 border border-gray-200">
                        <nuxt-link :to="`/user/${player.user.username}`">
                          <img src="/avatar.png" alt="">
                        </nuxt-link>
                      </div>
                    </div>
                  </td>
                  <td class="px-2 py-1">
                    <div class="flex gap-2 items-center">
                      <div>{{ item.level }}</div>
                      <div class="i-icons-bomb w-4 h-4"/>
                      <div>{{ item.num_bomb }}</div>
                    </div>
                  </td>
                  <td :class="{
                   'text-green-500': item.status === 'won',
                  'text-red-700': item.status === 'dead',
                  'text-blue-500': item.status === 'waiting',
                }" class="px-2 py-2">
                    <div class="flex gap-2 items-center justify-end">
                      <span>{{ item.time }}</span>
                      <div v-if="item.status == 'dead'" class="i-icons-dead w-4 h-4"/>
                      <div v-else-if="item.status == 'won'" class="i-icons-smile w-4 h-4"/>
                      <div v-else-if="item.status == 'ended'" class="i-icons-neutral w-4 h-4"/>
                      <div v-else-if="item.status == 'waiting'" class="i-icons-alarm w-4 h-4"/>
                      <div v-else class="i-icons-eye w-4 h-4"/>
                    </div>
                  </td>
                  <td class="px-2 py-1 text-xs">
                    <nuxt-link :to="`/room/${item.id}`" class="underline flex justify-end items-center">
                      <span>{{ item.since }}</span>
                    </nuxt-link>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
