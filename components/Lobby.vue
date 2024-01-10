<script setup lang="ts">
import {useAuthFetch} from "~/composables/useAuthFetch";
import {computed, ref} from "vue";
import {useUserStore} from "~/stores/user";
import type {ResponseRoom, Room} from "~/interface/gms";
import {useGlobalStore} from "~/stores/global";
import {useRoomStore} from "~/stores/room";
import {fullName} from "~/helpers";

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
    status__in: ['waiting', 'playing'].join(",")
  }
})

console.log(params.value);
const {data: response} = await useAuthFetch<ResponseRoom>('/gms/rooms/', {
  params: params,
  watch: [params],
  immediate: true
})
if (response.value) {
  roomStore.setRooms(response.value.results)
}
const items = computed<Room[]>(() => roomStore.rooms)

const getCreatorName = (room: Room) => {
  const index = room.gms_members.map(x => x.user.id).indexOf(room.user)
  if (index >= 0) {
    return fullName(room.gms_members[index].user)
  }
  return 'Unknown'
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex text-sm uppercase">
      <div class="font-bold leading-none">
        <img class="h-6" src="/lobby.png" alt="">
      </div>
    </div>
    <nuxt-link
      v-for="(item, i) in items" :key="i"
      :to="`/room/${item.id}`"
      class="rounded border p-3 flex font-bold text-sm"
    >
      <div class="flex-1 space-y-1">
        <div>{{ getCreatorName(item) }}</div>
        <div class="flex items-center gap-3 font-medium text-xs">
          <div class="flex gap-1 items-center">
            <img src="/coin.png" alt="" class="w-4 h-4">
            <div>{{ item.gms_members.length * item.ticket }}</div>
          </div>
          <div>{{ item.width }}x{{ item.height }}</div>
        </div>
      </div>
      <div>
        <div>
          <div
            class="flex justify-end items-center gap-2"
            :class="{'text-blue-500': item.status === 'playing'}"
          >
            <div v-if="item.status === 'waiting' && item.is_multiplayer">Join</div>
            <div v-else-if="item.status === 'playing'">Live</div>
            <div v-else>Waiting</div>
            <div class="relative flex h-3 w-3">
              <div v-if="item.status === 'playing'"
                   class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></div>
              <span
                class="relative inline-flex rounded-full h-3 w-3"
                :class="{
                  'bg-blue-500': item.status === 'playing',
                   'bg-green-500': item.status === 'waiting',
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>
