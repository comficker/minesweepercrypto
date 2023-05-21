<template>
  <div class="space-y-3 w-full max-w-md mx-auto md:py-6">
    <div class="flex items-center justify-between uppercase font-bold">
      <div class="text-sm">Control Panel</div>
    </div>
    <div class="space-y-2">
      <div v-if="false" class="flex items-center justify-between">
        <div>Balance</div>
        <div v-if="user && user.id" class="flex gap-2 items-center text-sm">
          <img src="/coin.png" class="w-5 h-5" alt="Coin"/>
          <b>{{ user.meta?.minesweeper?.balance || 0 }}</b>
        </div>
      </div>
      <div v-if="false" class="border rounded-lg p-4 space-y-4 bg-white">
        <div class="flex gap-3 uppercase font-bold text-gray-400 text-xs">
          <div
            v-for="m in modes" :key="m"
            class="cursor-pointer" :class="{'text-black': m === mode}"
            @click="mode = m"
          >{{m}}</div>
        </div>
        <div class="space-y-2">
          <div class="border rounded px-3 py-2">
            <chain-title :chain="mode === 'deposit' ? 'eth': 'zk'"/>
            <div class="flex justify-between items-center">
              <div class="shadow rounded flex gap-1 px-2 shadow-xs text-sm p-1 items-center">
                <div class="w-4 h-4 i-xx-icons-eth-2"/>
                <span>ETH</span>
                <div class="w-4 h-4 i-xx-icons-down"/>
              </div>
              <div class="text-right font-light">
                <input class="text-gray-500 text-xl outline-none text-right">
                <div class="text-gray-300 text-sm">Balance: 0</div>
              </div>
            </div>
          </div>
          <div>
            <div class="p-2 text-center bg-blue-500 text-white text-center rounded-lg font-semibold" @click="sendTX">
              <span>{{ mode === 'deposit' ? 'Deposit' : 'Withdraw' }}</span>
            </div>
          </div>
        </div>
      </div>
      <invite-form :show-history="false"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue"
import {useUserStore} from "~/composables/user";
import ChainTitle from "~/components/ChainTitle.vue";
import {ABI, CONTRACT_ADDRESS} from "@/constants"
import {arbitrum} from '@wagmi/core/chains'
import {publicProvider} from '@wagmi/core/providers/public'
import {
  connect,
  configureChains,
  createConfig,
  prepareWriteContract,
  writeContract,
  // sendTransaction,
  // watchAccount,
  // switchNetwork
} from '@wagmi/core'
import {InjectedConnector} from '@wagmi/core/connectors/injected'
import InviteForm from "~/components/InviteForm.vue";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum],
  [publicProvider()],
)

createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

const userStore = useUserStore()
const modes = ['deposit', 'withdraw', 'swap']
const mode = ref('deposit')
const user = computed(() => {
  return userStore.logged
})

const connectWallet = async () => {
  await connect({
    connector: new InjectedConnector(),
  })
}

const sendTX = async () => {
  const config = await prepareWriteContract({
    to: '',
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'sendToZk',
    args: [],
    overrides: {
      value: 0
    }
  })
  const {hash} = await writeContract(config)
}
</script>
