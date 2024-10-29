<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue'
import Renderer from '@/components/Game/RendererComponent.vue'
import Grid from '@/components/Game/GridComponent.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import StyledButton from '@/components/StyledButton.vue'
import { onBeforeRouteLeave } from 'vue-router'
import WaifuComponent from '@/components/WaifuComponent.vue'
import ChatComponent from '@/components/ChatComponent.vue'
import { useChatStore } from '@/stores/chat'
import ProgressBar from '@/components/ProgressBar.vue'

const bgMusic = new Audio('/assets/sounds/background_music.mp3')
const chatStore = useChatStore();
const isPlayButtonPressed = ref<boolean>(false)
const isPlayButtonViewActive = ref<boolean>(true)
const routeLeave = ref<boolean>(false)
const show = ref<boolean>(false)

const handlePlayButton = (): void => {
  isPlayButtonPressed.value = true
  isPlayButtonViewActive.value = false
  bgMusic.volume = import.meta.env.VITE_BACKGROUND_MUSIC_VOLUME
  bgMusic.play()
  bgMusic.loop = true
}

onBeforeRouteLeave(() => {
  routeLeave.value = true
})

onMounted(() => {
  setTimeout(() => {
    show.value = true
    chatStore.processDolphinRequest('Shortly introduce yourself in sexy way')
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
          <div v-show="show" class="glass-container">
            <div class="button-container" v-if="!isPlayButtonPressed">
                <WaifuComponent :chat="true" />
              <StyledButton @click="handlePlayButton" :disabled="!chatStore.response">Play</StyledButton>
            </div>
            <div class="game-screen-container" v-else>
              <TopPanel />
              <div class="game-screen-content">
                <Renderer :class="routeLeave ? 'renderer-hide' : 'renderer-show'">
                  <template #grid="{width}">
                    <Grid :width="width"  />
                  </template>
                </Renderer>
                <WaifuComponent :chat="true" />
              </div>
              <ProgressBar />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </main>
</template>

<style scoped>
.glass-container {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.game-screen-content {
  width: 100%;
  display: flex;
  gap: 10px;
}
.renderer-hide {
  opacity: 0;
}

.renderer-show {
  opacity: 1;
}
.game-screen {
  width: 100%;
  padding:20px;
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
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.button-container {
  max-width: 900px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>
