<template>
  <div v-if="chain === 'eth'" class="flex items-center gap-1">
    <svg aria-hidden="true" width="46.08" height="46.08" viewBox="-3.2 -3.2 38.4 38.4" fill="currentColor" class="mr-1 -ml-1 h-4 w-4 text-neutral-500"><path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0L6.254 16.297l9.819 5.807 9.823-5.801z"></path></svg>
    <span class="text-sm font-bold text-gray-400">Arbitrum Mainnet</span>
  </div>
  <div v-else class="flex items-center gap-1">
    <div class="w-4 h-4 i-xx-icons-zk text-gray-400"/>
    <span class="text-sm font-bold text-gray-400">zkSync Era Mainnet</span>
  </div>
</template>

<script>
export default {
  props: {
    chain: {
      type: String,
      default: 'eth'
    }
  }
}
</script>
