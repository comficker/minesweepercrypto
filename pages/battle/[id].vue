<template>
  <div class="w-full max-w-xl mx-auto space-y-4"></div>
</template>

<script lang="ts" setup>
import {useAuthFetch} from "~/composables/useAuthFetch";
import {useRoute} from "#app";
import {IGame} from "~/interface";

const {data: res} = await useAuthFetch<IGame>(`/minesweeper/games/${useRoute().params.id}`)
console.log(res.value);
</script>

<style scoped>

</style>
