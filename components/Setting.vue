<template>
  <div class="uppercase font-bold">Game Settings</div>
  <p class="text-gray-400">Play on your way!</p>
  <div class="space-y-3 mt-3">
    <div class="space-y-1">
      <div class="uppercase text-xs font-bold">Size</div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
          <span class="uppercase text-xs font-bold text-gray-400">Width</span>
          <input
            v-model="form.size.width"
            type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
            min="6" maxlength="32"
            placeholder="Width">
        </div>
        <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
          <span class="uppercase text-xs font-bold text-gray-400">Height</span>
          <input
            v-model="form.size.height"
            type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
            min="6" maxlength="32"
            placeholder="Height">
        </div>
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

const globalStore = useGlobalStore()
const form = ref<Setting>(JSON.parse(JSON.stringify(globalStore.setting)))

const submit = () => {
  globalStore.setSetting(JSON.parse(JSON.stringify(form.value)))
}
</script>
