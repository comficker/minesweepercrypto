<template>
  <div class="w-full max-w-lg mx-auto">
    <Game/>
  </div>
</template>

<script lang="ts" setup>
import {useRoute} from "#app";
import Game from "~/components/Game.vue";
import {useSeoMeta} from "nuxt/app";
import {useRoomStore} from "~/stores/room";

const route = useRoute()

const roomStore = useRoomStore()
await roomStore.makeGame(false, route.params.id?.toString())

const title = `Game #${route.params.id} | Minesweeper Online | MinesweeperCrypto | minesweeperbattle.com`
const desc = `Join and watch playing Minesweeper online: Game #${route.params.id}`

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
