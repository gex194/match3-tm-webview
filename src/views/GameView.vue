<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue'
import Renderer from '@/components/Game/RendererComponent.vue'
import Grid from '@/components/Game/GridComponent.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import StyledButton from '@/components/StyledButton.vue'
import { onBeforeRouteLeave } from 'vue-router'

const bgMusic = new Audio('/assets/sounds/background_music.mp3')

const isPlayButtonPressed = ref<boolean>(false)
const isPlayButtonViewActive = ref<boolean>(true)
const routeLeave = ref<boolean>(false)
const show = ref<boolean>(false)

const handlePlayButton = (): void => {
  isPlayButtonPressed.value = true
  isPlayButtonViewActive.value = false
  bgMusic.volume = 0.3
  bgMusic.play()
  bgMusic.loop = true
}

onBeforeRouteLeave(() => {
  routeLeave.value = true
})

onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 700)
})

onUnmounted(() => {
  bgMusic.pause()
})
</script>

<template>
  <main>
    <Transition name="fade">
      <div :class="isPlayButtonViewActive ? 'game-screen-button' : 'game-screen'" v-show="show">
        <Transition name="fade">
          <div v-show="show">
            <div class="button-container" v-if="!isPlayButtonPressed">
              <StyledButton @click="handlePlayButton">Play</StyledButton>
            </div>
            <div class="game-screen-container" v-else>
              <TopPanel />
              <Renderer :class="routeLeave ? 'renderer-hide' : 'renderer-show'">
                <Grid />
              </Renderer>
              <div>
                <img src="/assets/images/duck.gif" width="150" height="150" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.renderer-hide {
  opacity: 0;
}

.renderer-show {
  opacity: 1;
}
.game-screen {
  width: 100%;
  height: 100%;
  min-height: var(--tg-viewport-height);
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
  gap: 10px;
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
