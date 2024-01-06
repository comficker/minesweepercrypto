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
const form = ref<Setting>({
  width: roomStore.options.width,
  height: roomStore.options.height,
  is_multiplayer: roomStore.options.is_multiplayer,
  num_bomb: Math.floor(roomStore.options.width * roomStore.options.height * 0.2)
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
    <div v-if="useUserStore().isLogged" class="flex items-center gap-2">
      <span class="uppercase text-xs font-bold" id="Multiplayer">Multiplayer</span>
      <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
      <button
        type="button"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
        :class="{'bg-indigo-600': form.is_multiplayer, 'bg-gray-200': !form.is_multiplayer}"
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
      <div v-if="errors.length" class="p-3 py-2 text-sm border bg-yellow-50 space-y-1">
        <div class="flex gap-2 items-center">
          <div class="i-icons-alert w-5 h-5 pt-2"/>
          <div class="text-red-500 uppercase text-xs font-bold">Errors</div>
        </div>
        <ul class="list-disc pl-5">
          <li v-for="item in errors">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="cursor-pointer bg-emerald-900 font-bold px-4 text-center text-white rounded py-2" @click="submit">
      Save
    </div>
  </div>
</template>
