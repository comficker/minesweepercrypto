<script setup lang="ts">
import {useAuthFetch} from "~/composables/useAuthFetch";
import {computed, ref} from "vue";
import {useUserStore} from "~/stores/user";
import {countDownTimer, timeSince} from "~/helpers";
import type {ResponseRoom, Room} from "~/interface/gms";
import {useGlobalStore} from "~/stores/global";

const userStore = useUserStore()
const globalStore = useGlobalStore()
const logged = computed(() => {
  return userStore.logged
})

const mode = ref('History')
const page = ref(1)

const params = computed(() => {
  const params: any = {
    page_size: 20,
    ordering: '-id',
    page: page.value
  }
  if (mode.value !== 'History' && logged.value && logged.value.id) {
    params['user__id'] = logged.value.id
  }
  if (mode.value === 'Leaderboard') {
    params['ordering'] = '-score'
    params['status'] = 'win'
  }
  return params
})

const {data: response} = await useAuthFetch<ResponseRoom>('/gms/rooms/', {
  params: params,
  watch: [params],
  immediate: true,
  key: "history"
})

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
</script>

<template>
  <div class="space-y-2 p-3 border rounded mx-auto max-w-lg">
    <div class="flex justify-between">
      <div class="flex items-center gap-3 text-sm font-bold">
        <div
          v-for="item in ['History', 'Mine']"
          class="cursor-pointer p-2 rounded flex gap-2 items-center"
          :class="mode !== item ? 'bg-white text-neutral-80 shadow hover:shadow-lg duration-200': 'shadow-inner'"
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
    <div class="overflow-hidden w-full bg-white flex" :class="{'items-center': items.length === 0}">
      <div class="flow-root text-sm w-full">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full space-y-3">
            <table v-if="items.length" class="min-w-full table-fixed overflow-auto text-left">
              <thead>
              <tr role="rowheader" class="font-semibold text-gray-500">
                <th role="columnheader" class="w-32 px-2 py-1.5">Size</th>
                <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Time</th>
                <th role="columnheader" class="px-2 pl-2 pl-2 text-left">User</th>
                <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Date</th>
              </tr>
              </thead>
              <tbody class="whitespace-nowrap font-bold">
              <tr role="row" v-for="(item, i) in items" :key="i" class="rounded border-t-4 border-white">
                <td class="px-2 py-1">{{ item.level }}</td>
                <td :class="{
                  'text-green-500': item.status === 'won',
                  'text-red-500': item.status === 'dead',
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
                <td class="px-2 py-1 text-left">
                  <div class="flex -space-x-3 mt-1">
                    <div class="w-8 h-8 rounded bg-white p-1 border border-gray-200">
                      <img src="/avatar.png" alt="">
                    </div>
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
            <div v-else-if="!userStore.isLogged" class="pt-4 h-full flex flex-col justify-center items-center">
              <div class="font-bold uppercase">Member's feature!</div>
              <p>You must <span class="underline cursor-pointer" @click="globalStore.setModal('login')">login</span> or
                <span class="underline cursor-pointer" @click="globalStore.setModal('register')">register</span> to view
                your game history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
