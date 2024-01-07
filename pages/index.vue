<script lang="ts" setup>
import {useSeoMeta} from "nuxt/app";
import Game from "~/components/Game.vue";
import {useRoomStore} from "~/stores/room";

const title = "Minesweeper Battle | Minesweeper Online | MinesweeperCrypto | minesweeperbattle.com"
const desc = 'Minesweeper is a classic strategy room where players must uncover hidden mines on a grid without detonating them.'
const roomStore = useRoomStore()
roomStore.makeGame()

useSeoMeta({
  applicationName: 'Minesweeper Battle',
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogImage: '/banner.jpg',
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <div class="w-full max-w-lg mx-auto space-y-4">
    <Game/>
  </div>
</template>
