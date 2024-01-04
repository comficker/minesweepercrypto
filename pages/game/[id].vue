<template>
  <div class="w-full max-w-lg mx-auto">
    <Game/>
  </div>
</template>

<script lang="ts" setup>
import {IGame} from "~/interface";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {useRoute} from "#app";
import {useGameStore} from "~/stores/game";
import Game from "~/components/Game.vue";
import {useSeoMeta} from "nuxt/app";

const gs = useGameStore()

const res = await useAuthFetch<IGame>(`/minesweeper/games/${useRoute().params.id}/`)

if (res.data.value) {
  gs.init(res.data.value)
}

const title = `Game #${gs.id} | Minesweeper Online | MinesweeperCrypto | minesweeperbattle.com`
const desc = `Join and watch playing Minesweeper online: Game #${gs.id}`
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
