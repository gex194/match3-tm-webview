<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue'
</script>

<template>
  <main class="game-screen">
    <TopPanel />
  </main>
</template>

<style scoped>
.game-screen {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-image: url('/src/assets/images/waifu-game-screen.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
