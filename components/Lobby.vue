<script setup lang="ts">
import {useAuthFetch} from "~/composables/useAuthFetch";
import {computed, ref} from "vue";
import {useUserStore} from "~/stores/user";
import type {ResponseRoom, Room} from "~/interface/gms";
import {useGlobalStore} from "~/stores/global";
import {useRoomStore} from "~/stores/room";

const userStore = useUserStore()
const globalStore = useGlobalStore()
const roomStore = useRoomStore()
const logged = computed(() => {
  return userStore.logged
})

const mode = ref('History')
const page = ref(1)

const params = computed(() => {
  return {
    page_size: 5,
    ordering: '-id',
    page: page.value,
    status: 'waiting'
  }
})

const {data: response} = await useAuthFetch<ResponseRoom>('/gms/rooms/', {
  params: params,
  watch: [params],
  immediate: true
})
if (response.value) {
  roomStore.setRooms(response.value.results)
}
const items = computed<Room[]>(() => roomStore.rooms)
</script>

<template>
  <div class="space-y-2 p-3 border rounded mx-auto max-w-lg">
    <div class="font-bold leading-none">Lobby</div>
    <div class="overflow-hidden w-full bg-white flex" :class="{'items-center': items.length === 0}">
      <div class="flow-root text-sm w-full">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full space-y-3">
            <table v-if="items.length" class="min-w-full table-fixed overflow-auto">
              <tbody class="whitespace-nowrap font-bold">
              <tr role="row" v-for="(item, i) in items" :key="i" class="rounded border-t-4 border-white">
                <td class="px-2 py-1">{{ item.width }}x{{ item.height }}</td>
                <td class="px-2 py-1 text-left">
                  <div class="flex gap-1 items-center">
                    <img src="/coin.png" class="w-4 h-4" alt="Coin"/>
                    <span>{{ item.gms_members.length * item.ticket }}</span>
                  </div>
                </td>
                <td class="px-2 py-1 text-xs">
                  <nuxt-link :to="`/room/${item.id}`" class="underline flex justify-end items-center text-blue-500">
                    <div>Join</div>
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
