<script lang="ts" setup>
import {useSeoMeta} from "nuxt/app";
import {useUserStore} from "~/stores/user";
import Game from "~/components/Game.vue";
import {watch} from "vue";
import InviteForm from "~/components/InviteForm.vue";
import {useGameStore} from "~/stores/game";

const title = "Minesweeper Battle | Minesweeper Online | MinesweeperCrypto | minesweeperbattle.com"
const desc = 'Minesweeper is a classic strategy game where players must uncover hidden mines on a grid without detonating them.'

useSeoMeta({
  applicationName: 'Minesweeper Battle',
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogImage: '/banner.jpg',
  twitterCard: 'summary_large_image',
})

const userStore = useUserStore()
const gameStore = useGameStore()

watch(() => userStore.isLogged, (n) => {
  if (n) {
    gameStore.newGame()
  }
})
</script>
<template>
  <div class="w-full max-w-lg mx-auto space-y-4">
    <Game/>
  </div>
</template>
