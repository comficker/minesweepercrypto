<script lang="ts" setup>
import {ref} from "vue"
import {parseEther} from "ethers";

const {$makeTransaction} = useNuxtApp()
const amount = ref(1)
const sending = ref(false)
const tx = ref<string | null>(null)

const submit = async () => {
  sending.value = true
  tx.value = await $makeTransaction(parseEther(amount.value.toString()))
  sending.value = false
}
</script>

<template>
  <div class="uppercase text-sm font-bold">Buy $GMS</div>
  <div class="space-y-3 mt-3">
    <div class="space-y-3">
      <div class="flex rounded w-full border p-2 hover:shadow duration-200 items-center gap-1">
        <span class="uppercase text-xs font-bold text-gray-400">Amount</span>
        <input
          v-model="amount"
          type="number" class="flex-1 px-2 bg-transparent autofill:bg-transparent outline-none"
          placeholder="Amount in OXOA">
      </div>
    </div>
    <div class="cursor-pointer bg-emerald-900 font-bold px-4 text-center text-white rounded py-2" @click="submit">
      <span>{{sending ? 'Waiting for confirmation': 'Send transaction'}}</span>
    </div>
    <div v-if="!sending && tx" class="text-center flex justify-center gap-2">
      <div>TX:</div>
      <a
        :href="`https://testnet-blockscout.oxoa.games/tx/${tx}`" target="_blank"
      >{{ `${tx.substring(0, 5)}...${tx.substring(tx.length - 6, tx.length)}` }}</a>
    </div>
  </div>
</template>
