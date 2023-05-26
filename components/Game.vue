<template>
  <div class="space-y-3">
    <game-header/>
    <game-body/>
    <div class="flex justify-between">
      <a target="_blank" class="text-xs uppercase underline font-bold flex items-center gap-1" href="/how-to-play">
        <div class="i-icons-info w-5 h-5"/>
        <span>How to play minesweeper?</span>
      </a>
      <div class="flex justify-end gap-4 flex-wrap grayscale">
        <div id="market-apple" class="flex gap-1 items-center">
          <img class="w-4" width="24px" height="24px" src="/market/apple-logo.png" alt="">
          <div class="hidden md:block text-xs">
            <div class="uppercase font-bold">IOS</div>
          </div>
        </div>
        <div id="market-google" class="flex gap-1 items-center">
          <img class="w-4" width="24px" height="24px" src="/market/google-play-logo.png" alt="">
          <div class="hidden md:block text-xs">
            <div class="uppercase font-bold">Android</div>
          </div>
        </div>
        <div id="market-telegram" class="flex gap-1 items-center">
          <img class="w-4" width="24px" height="24px" src="/market/telegram.png" alt="">
          <div class="hidden md:block text-xs">
            <div class="uppercase font-bold">Telegram</div>
          </div>
        </div>
      </div>
    </div>
    <game-result/>
  </div>
</template>

<script lang="ts" setup>
import GameHeader from "~/components/GameHeader.vue";
import GameBody from "~/components/GameBody.vue";
import GameResult from "~/components/GameResult.vue";
</script>
