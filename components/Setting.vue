<script lang="ts" setup>
import {ref} from "vue"
import type {Setting} from "~/interface";
import {useCookie} from "#app";
import {useUserStore} from "~/stores/user";
import {useRoomStore} from "~/stores/room";
import {useGlobalStore} from "~/stores/global";

const cookieFormSize = useCookie('form.size')
const roomStore = useRoomStore()
const globalStore = useGlobalStore()
const userStore = useUserStore()
const form = ref<Setting>({
  width: roomStore.options.width,
  height: roomStore.options.height,
  is_multiplayer: roomStore.options.is_multiplayer,
  num_bomb: Math.round(roomStore.options.width * roomStore.options.height * 0.2),
  ticket: 0
})

const user = computed(() => userStore.logged)

const {data: res} = await useAuthFetch('/gms/potential-earn', {
  params: form,
  watch: [form]
})

const submit = () => {
  if (errors.value.length > 0) return;
  cookieFormSize.value = `${form.value.width}_${form.value.height}`
  roomStore.setting({
    ...roomStore.options,
    ...form.value
  })
  roomStore.makeGame(true)
  globalStore.setModal('')
}

const errors = computed(() => {
  const out = []
  if (form.value.width > form.value.height)
    out.push("Width must be lower than or equal height!")

  if (form.value.height > 32)
    out.push("Sorry! We currently don't support large size!")

  return out
})

watch(() => roomStore.options, (n) => {
  form.value.width = n.width
  form.value.height = n.height
  form.value.is_multiplayer = n.is_multiplayer
})

watch(() => [form.value.width, form.value.height], () => {
  form.value.num_bomb = Math.floor(form.value.width * form.value.height * 0.2)
})
</script>

<template>
  <div class="uppercase text-sm font-bold">Game Settings</div>
  <p class="text-gray-400">Play on your way!</p>
  <div class="space-y-3 mt-3">
    <div class="space-y-3">
      <div class="uppercase text-xs font-bold">Size</div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
          <span class="uppercase text-xs font-bold text-gray-400">Width</span>
          <input
            v-model="form.width"
            type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
            min="6" :max="form.height"
            placeholder="Width">
        </div>
        <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
          <span class="uppercase text-xs font-bold text-gray-400">Height</span>
          <input
            v-model="form.height"
            type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
            min="6" max="32"
            placeholder="Height">
        </div>
      </div>
      <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
        <span class="uppercase text-xs font-bold text-gray-400">Bomb</span>
        <input
          v-model="form.num_bomb"
          type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
          min="1" :max="0.75 * form.width * form.height"
          placeholder="Width">
      </div>
      <div v-if="errors.length" class="p-3 py-2 text-sm border bg-yellow-50 space-y-1">
        <div class="flex gap-2 items-center">
          <div class="i-icons-alert w-5 h-5 pt-2"/>
          <div class="text-red-500 uppercase text-xs font-bold">Errors</div>
        </div>
        <ul class="list-disc pl-5">
          <li v-for="item in errors">{{ item }}</li>
        </ul>
      </div>
    </div>
    <div class="relative" :class="{'ring p-3 rounded ring-red': !userStore.isLogged}">
      <div class="space-y-2" :class="{'opacity-50 cursor-not-allowed blur-[0.5px]': !userStore.isLogged}">
        <div class="flex items-center gap-2">
          <span class="uppercase text-xs font-bold" id="Multiplayer">Multiplayer</span>
          <button
            type="button"
            :disabled="!userStore.isLogged"
            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            :class="{'bg-indigo-600': form.is_multiplayer, 'bg-gray-200': !form.is_multiplayer, 'cursor-not-allowed': !userStore.isLogged}"
            role="switch" aria-checked="false" aria-labelledby="Multiplayer"
            @click="form.is_multiplayer = !form.is_multiplayer"
          >
        <span
          aria-hidden="true"
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          :class="{'translate-x-5': form.is_multiplayer, 'translate-x-0': !form.is_multiplayer}"
        />
          </button>
        </div>
        <div class="space-y-1.5 font-bold">
          <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
            <span class="uppercase text-xs font-bold text-gray-400">Ticket</span>
            <input
              v-model="form.ticket"
              :disabled="!(userStore.isLogged && form.is_multiplayer)"
              type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
              min="0" :max="userStore.balance"
              placeholder="Width">
          </div>
          <nuxt-link
            to="/manager"
            class="flex gap-1 text-sm text-orange-500 cursor-pointer"
          >
            <span>Balance:</span>
            <b>{{ userStore.balance }}</b>
          </nuxt-link>
          <div class="flex gap-1 text-sm text-blue-500">
            <span>Potential earn:</span>
            <b>{{form.is_multiplayer ? `${form.ticket}+` : res || 0}}</b>
          </div>
        </div>
      </div>
      <div v-if="!userStore.isLogged" class="absolute inset-0 flex items-center justify-center">
        <div class="uppercase text-sm font-bold cursor-pointer" @click="globalStore.setModal('login')">
          <img class="h-6" src="/login.png" alt="Login Button">
        </div>
      </div>
    </div>
    <div class="cursor-pointer bg-emerald-900 font-bold px-4 text-center text-white rounded py-2" @click="submit">Save game</div>
  </div>
</template>
