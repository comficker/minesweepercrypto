<template>
<div class="w-full max-w-lg mx-auto space-y-4">
  <div class="space-y-3 text-sm">
    <h2 class="text-2xl font-bold">How to play Minesweeper?</h2>
    <p class="font-bold">Minesweeper is a classic strategy game where players must uncover hidden mines on a grid
      without detonating them. Here are the basic steps to play minesweeper:</p>
    <ul class="list-decimal pl-8 space-y-2">
      <li>Start by clicking on any square on the board. This will reveal a number indicating how many mines are
        touching that square.
      </li>
      <li>Use the numbers revealed in step 1 to deduce where the mines might be located. For example, if a square
        shows the number 2, it means that two of the eight squares surrounding that square contain mines.
      </li>
      <li>Use right-click to place a flag on the squares you think contain mines. This can help you keep track of
        which squares are safe to uncover.
      </li>
      <li>Continue uncovering squares, using the numbers as clues to find the mines. Try to avoid clicking on squares
        you suspect contain mines, as doing so will detonate them and end the game.
      </li>
      <li>If you uncover all the squares that don't contain mines, you win the game. If you detonate a mine, you lose
        the game.
      </li>
    </ul>
    <p class="italic text-sm">Minesweeper can be played with various levels of difficulty, ranging from beginner to
      expert. It's a great game for improving logic and strategic thinking skills, and can be a lot of fun once you
      get the hang of it.</p>
  </div>
</div>
</template>

<script lang="ts" setup>
import {useSeoMeta} from "nuxt/app";

const title = "How to play minesweeper online | minesweeperbattle.com"
const desc = 'Minesweeper requires careful observation and logical deduction to succeed. Are you ready to put your wits to the test and see if you can uncover all the mines'
useSeoMeta({
  title: title,
  description: desc,
  ogDescription: desc,
  ogTitle: title,
  ogImage: '/banner.jpg',
  twitterCard: 'summary_large_image',
})
</script>
