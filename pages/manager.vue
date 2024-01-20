<template>
  <div class="space-y-3 w-full max-w-lg mx-auto">
    <client-only>
      <div class="space-y-6 min-h-md flex flex-col items-center justify-center">
        <div class="flex items-center flex-col gap-6 justify-center">
          <div class="text-xs uppercase font-bold">Balance</div>
          <div v-if="userStore.isLogged" class="flex gap-2 items-center text-6xl font-mono">
            <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
            <b>{{ userStore.balance }}</b>
          </div>
        </div>
        <div class="flex justify-center gap-6">
          <div class="min-w-32 text-center bg-blue-500 cursor-pointer rounded p-2 px-6 text-white">Deposit</div>
          <div class="min-w-32 text-center cursor-pointer rounded p-2 px-6 border">Withdraw</div>
        </div>
        <div class="flex justify-center">
          <div class="rounded text-xs p-1 px-3 shadow bg-amber-2">Coming soon!</div>
        </div>
      </div>
      <div>
        <table v-if="tx.results.length" class="text-xs min-w-full table-fixed overflow-auto text-left">
          <thead>
          <tr role="rowheader" class="font-semibold text-gray-500">
            <th role="columnheader" class="px-2 pl-2 pl-2 text-left">Note</th>
            <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Amount</th>
            <th role="columnheader" class="w-32 px-2 py-1.5 text-right">Date</th>
          </tr>
          </thead>
          <tbody class="whitespace-nowrap font-bold">
          <tr role="row" v-for="(item, i) in tx.results" :key="i" class="rounded border-t-4 border-white">
            <td class="px-2 py-1 text-left">
              {{ item.note.split("_")[1] }}
            </td>
            <td class="px-2 py-2 text-right">
              <div class="flex justify-end items-center gap-1">
                <div>{{item.from_user == user.id ? '-' : '+'}}</div>
                <div>{{ item.amount}}</div>
                <img class="w-4 h-4" src="/coin.png" alt="">
              </div>
            </td>
            <td class="px-2 py-1 text-right">
              {{ timeSince(item.created)}}
            </td>
          </tr>
          </tbody>
        </table>
        <div class="flex justify-center items-center gap-3">
          <div
            class="p-2 rounded"
            :class="{'bg-white cursor-pointer shadow hover:shadow-lg duration-200': !!tx.links?.previous}"
            @click="page--"
          >
            <div class="i-icons-left w-4 h-4"/>
          </div>
          <div
            class="p-2 rounded"
            :class="{'bg-white cursor-pointer shadow hover:shadow-lg duration-200': !!tx.links?.next}"
            @click="page++"
          >
            <div class="i-icons-right w-4 h-4"/>
          </div>
        </div>
      </div>
      <invite-form v-if="userStore.isLogged" :show-history="false"/>
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {useUserStore} from "~/stores/user";
import InviteForm from "~/components/InviteForm.vue";
import type {APIResponse, Transaction} from "~/interface";
import {timeSince} from "~/helpers";

const userStore = useUserStore()

const user = computed(() => {
  return userStore.logged
})

const page = ref(1)

const params = computed(() => ({
  page: page.value,
  user__username: user.value.username
}))

const {data: tx} = await useAuthFetch<APIResponse<Transaction>>('/activity/transactions/', {
  method: "GET",
  params: params,
  watch: [params]
})
</script>
