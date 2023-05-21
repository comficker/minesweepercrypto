<template>
  <div class="uppercase text-sm font-bold">Game Settings</div>
  <p class="text-gray-400">Play on your way!</p>
  <div class="space-y-3 mt-3">
    <div class="flex w-full gap-2 items-center">
      <input
        v-model="form.soundOn"
        type="checkbox" class="bg-transparent autofill:bg-transparent outline-none p-2 w-4 h-4"
      >
      <span class="uppercase text-xs font-bold text-gray-400">Open sound</span>
    </div>
    <div class="space-y-1">
      <div class="uppercase text-xs font-bold">Size</div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
          <span class="uppercase text-xs font-bold text-gray-400">Width</span>
          <input
            v-model="form.size.width"
            type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
            min="6" :max="form.size.height"
            placeholder="Width">
        </div>
        <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
          <span class="uppercase text-xs font-bold text-gray-400">Height</span>
          <input
            v-model="form.size.height"
            type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
            min="6" max="32"
            placeholder="Height">
        </div>
      </div>
      <div v-if="form.size.width > form.size.height" class="p-3 py-1 text-sm border bg-yellow-50 flex items-center gap-2">
        <div class="i-icons-alert w-3 h-3"/>
        <span>Width must be lower than or equal height</span>
      </div>
    </div>
    <div class="cursor-pointer bg-emerald-900 font-bold px-4 text-center text-white rounded py-2" @click="submit">
      Save
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {Setting} from "~/interface";
import {useGlobalStore} from "~/composables/global";
import {useCookie} from "#app";

const cookieFormSize = useCookie('form.size')
const globalStore = useGlobalStore()
const form = ref<Setting>(JSON.parse(JSON.stringify(globalStore.setting)))

const submit = () => {
  if (form.value.size.width > form.value.size.height) return;
  cookieFormSize.value = `${form.value.size.width}_${form.value.size.height}`
  globalStore.setSetting(JSON.parse(JSON.stringify(form.value)))
}
</script>
