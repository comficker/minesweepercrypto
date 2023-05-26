<template>
  <div class="w-full max-w-xl mx-auto space-y-4">
    <game :game="game"/>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue"
import {useAuthFetch} from "~/composables/useAuthFetch";
import {useRoute} from "#app";
import {IGame} from "~/interface";
import Game from "~/components/Game.vue";

const res = await useAuthFetch<IGame>(`/minesweeper/games/${useRoute().params.id}/`)
const game = ref<IGame>(res.data.value as IGame)
</script>
