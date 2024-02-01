<script setup lang="ts">
import {useAuthFetch} from "~/composables/useAuthFetch";
import {computed} from "vue";
import {useUserStore} from "~/stores/user";
import {useGlobalStore} from "~/stores/global";
import {fullName} from "~/helpers";
import type {User} from "~/interface";

const userStore = useUserStore()
const globalStore = useGlobalStore()
const logged = computed(() => {
  return userStore.logged
})

function getMonday(d: Date) {
  d = new Date(d);
  let day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

const ranges = [
  {key: 'all_time', name: 'All time',},
  {key: 'd_0', name: 'Today',},
  {key: 'd_-1', name: 'Yesterday'},
  {key: 'w_0', name: 'Current week'},
  {key: 'w_-1', name: 'Last week'}
]

const selectRange = ref('all_time')
const timeRange = computed(() => {
  let from, to;
  const now = new Date()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)

  if (selectRange.value.startsWith("d")) {
    const d = Number.parseInt(selectRange.value.replace("d_", ""))
    now.setDate(now.getDate() + d)
    from = now.getTime() / 1000
    now.setDate(now.getDate() + 1)
    to = now.getTime() / 1000
  } else if (selectRange.value.startsWith("w")) {
    const w = Number.parseInt(selectRange.value.replace("w_", ""))
    now.setDate(now.getDate() + w * 7)
    const monday = getMonday(now)
    from = monday.getTime() / 1000
    monday.setDate(now.getDate() + 7)
    to = monday.getTime() / 1000
  }
  return {
    from, to
  }
})

const {data: response} = await useAuthFetch<User[]>('/gms/leaderboard', {
  key: "leaderboard",
  params: timeRange,
  watch: [timeRange]
})

const computeWinRate = (user: User) => {
  const meta = user.meta.game_minesweeper || {}
  const won = meta['won'] || 0
  const dead = meta['dead'] || 0
  if (won + dead > 0) {
    return `${(100 * won / (won + dead)).toFixed(2)}%`
  }
  return '0%'
}
</script>

<template>
  <div class="space-y-2 mx-auto max-w-lg">
    <div class="flex items-center gap-3 text-sm font-bold">
      <div
        v-for="item in ranges"
        class="cursor-pointer p-2 rounded flex gap-2 items-center"
        :class="selectRange !== item.key ? 'bg-white text-neutral-80 shadow hover:shadow-lg duration-200': 'shadow-inner'"
        @click="selectRange = item.key"
      >
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div class="overflow-hidden w-full bg-white flex" :class="{'items-center': response.length === 0}">
      <div class="flow-root text-sm w-full">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full space-y-3">
            <table v-if="response.length" class="min-w-full table-fixed overflow-auto text-left text-xs">
              <thead>
              <tr role="rowheader" class="font-semibold text-xs uppercase text-gray-500">
                <th role="columnheader" class="px-2 pl-2 pl-2 text-left w-10"></th>
                <th role="columnheader" class="px-2 pl-2 pl-2 text-left">User</th>
                <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Win rate</th>
                <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Score</th>
                <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Token</th>
              </tr>
              </thead>
              <tbody class="whitespace-nowrap font-bold">
              <tr role="row" v-for="(item, i) in response" :key="i" class="rounded border-t-4 border-white">
                <td class="px-2 py-1">{{ i + 1 }}</td>
                <td class="px-2 py-1">
                  <nuxt-link :to="`/user/${item.username}`">{{ fullName(item) }}</nuxt-link>
                </td>
                <td class="px-2 py-1 text-right">{{ computeWinRate(item) }}</td>
                <td class="px-2 py-1 text-right">{{ item.meta?.game_minesweeper?.score || 0 }}</td>
                <td class="px-2 py-1 text-right">{{ item.meta?.game_minesweeper?.GMS || 0 }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
