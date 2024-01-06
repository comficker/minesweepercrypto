<script setup lang="ts">
import {computed} from "vue";
import {useUserStore} from "~/stores/user";
import InviteForm from "~/components/InviteForm.vue";
import {useRoomStore} from "~/stores/room";
import {useGlobalStore} from "~/stores/global";
import {fullName} from "~/helpers";

const userStore = useUserStore()
const roomStore = useRoomStore()
const globalStore = useGlobalStore()
const logged = computed(() => {
  return userStore.logged
})

const members = computed(() => roomStore.data.gms_members.sort(x => 0 - x.order))

const approve = (id: number, status: string) => {
  useAuthFetch(`/gms/approve/${id}`, {method: "POST", body: {status}})
}
</script>

<template>
  <div v-if="!userStore.isLogged" class="h-full flex flex-col justify-center items-center p-3 border rounded">
    <div class="font-bold uppercase">Join!</div>
    <p><span class="underline cursor-pointer" @click="globalStore.setModal('login')">Login</span> or
      <span class="underline cursor-pointer" @click="globalStore.setModal('register')">register</span> to play with your friend</p>
  </div>
  <div v-else-if="roomStore.data.gms_members.length" class="md:rounded md:border overflow-hidden w-full bg-white md:px-3 pt-2 pb-2 text-sm">
    <client-only>
      <table class="min-w-full table-fixed overflow-auto">
        <thead>
        <tr role="rowheader" class="font-semibold text-right">
          <th role="columnheader" class="px-2 pl-2 pr-2 sm:pl-0 text-left">Players</th>
          <th role="columnheader" class="w-32 px-2 py-1.5">Status</th>
          <th role="columnheader" class="w-32 px-2 py-1.5">Time</th>
          <th role="columnheader" class="w-32 px-2 py-1.5">Score</th>
        </tr>
        </thead>
        <tbody class="whitespace-nowrap font-bold">
        <tr
          v-for="(item, i) in members" :key="i"
          role="row" class="rounded text-right"
        >
          <td class="px-2 py-2 text-left">{{ fullName(item.user) }}</td>
          <td class="px-2 py-2">
            <div
              v-if="roomStore.data.status =='waiting' && item.status === 'pending' && userStore.isLogged && (roomStore.isCreator || item.user.id === userStore.logged.id)"
              class="p-1 py-0.5 text-xs bg-blue-500 rounded cursor-pointer inline-flex text-white"
              @click="approve(item.id, roomStore.isCreator ? 'waiting' : 'deleted')"
            >
              <span v-if="roomStore.isCreator">Approve</span>
              <span v-else>Cancel</span>
            </div>
            <div v-else>{{item.status}}</div>
          </td>
          <td class="px-2 py-2" :class="item.status === 'won' ? 'text-blue-500': 'text-red-500'">0</td>
          <td class="px-2 py-2">{{ item.score || 0 }}</td>
        </tr>
        </tbody>
      </table>
    </client-only>
  </div>
  <invite-form v-else :show-history="false"/>
</template>
