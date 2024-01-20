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

const {data: response} = await useAuthFetch<User[]>('/gms/leaderboard', {
  key: "leaderboard"
})
</script>

<template>
  <div class="space-y-2 p-3 border rounded mx-auto max-w-lg">
    <div class="overflow-hidden w-full bg-white flex" :class="{'items-center': response.length === 0}">
      <div class="flow-root text-sm w-full">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full space-y-3">
            <table v-if="response.length" class="min-w-full table-fixed overflow-auto text-left">
              <thead>
              <tr role="rowheader" class="font-semibold text-gray-500">
                <th role="columnheader" class="px-2 pl-2 pl-2 text-left w-10"></th>
                <th role="columnheader" class="px-2 pl-2 pl-2 text-left">User</th>
                <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Token</th>
              </tr>
              </thead>
              <tbody class="whitespace-nowrap font-bold">
              <tr role="row" v-for="(item, i) in response" :key="i" class="rounded border-t-4 border-white">
                <td class="px-2 py-1">{{ i + 1 }}</td>
                <td class="px-2 py-1">
                  <nuxt-link :to="`/user/${item.username}`">{{ fullName(item) }}</nuxt-link>
                </td>
                <td class="px-2 py-1 text-xs text-right">{{ item.meta?.game_minesweeper?.GMS }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
