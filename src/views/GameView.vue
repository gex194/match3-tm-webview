<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue'
import Renderer from '@/components/Game/RendererComponent.vue'
import Grid from '@/components/Game/GridComponent.vue'
import { onMounted, onUnmounted, reactive } from 'vue'
import StyledButton from '@/components/StyledButton.vue'

const bgMusic = new Audio('/assets/sounds/background_music.mp3')
const state = reactive({
  isPlayButtonPressed: false,
  isPlayButtonViewActive: true
})

const handlePlayButton = () => {
  state.isPlayButtonPressed = true
  state.isPlayButtonViewActive = false
  bgMusic.volume = 0.3
  bgMusic.play()
  bgMusic.loop = true
}

onMounted(() => {})
onUnmounted(() => {
  bgMusic.pause()
})
</script>

<template>
  <main :class="state.isPlayButtonViewActive ? 'game-screen-button' : 'game-screen'">
    <div class="button-container" v-if="!state.isPlayButtonPressed">
      <StyledButton @click="handlePlayButton">Play</StyledButton>
    </div>
    <div class="game-screen-container" v-else>
      <TopPanel />
      <Renderer>
        <Grid />
      </Renderer>
      <div>
        <img src="/assets/images/duck.gif" width="150" height="150" />
      </div>
    </div>
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
  background-image: url('/assets/images/waifu-game-screen.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.game-screen-button {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  background-image: url('/assets/images/waifu-game-screen.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.game-screen-container {
  display: flex;
  flex-direction: column;
  gap: 60px;
  align-items: center;
  justify-content: center;
}

.button-container {
  display: flex;
  align-content: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
