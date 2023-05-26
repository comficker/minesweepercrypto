<template>
  <div class="w-full max-w-xl mx-auto">
    <Game/>
  </div>
</template>

<script lang="ts" setup>
import {IGame} from "~/interface";
import {useAuthFetch} from "~/composables/useAuthFetch";
import {useRoute} from "#app";
import {useGameStore} from "~/composables/game";
import Game from "~/components/Game.vue";

const gs = useGameStore()

const res = await useAuthFetch<IGame>(`/minesweeper/games/${useRoute().params.id}/`)

if (res.data.value) {
  gs.init(res.data.value)
}
</script>
