<script setup lang="ts">
import TopPanel from '@/components/TopPanel.vue'
import Renderer from '@/components/Game/RendererComponent.vue'
import Grid from '@/components/Game/GridComponent.vue'
import GridGPT from '@/components/Game/GirdComponent_GPT.vue'
import {onMounted, onUnmounted, reactive} from 'vue'
import StyledButton from '@/components/StyledButton.vue'
import {onBeforeRouteLeave} from 'vue-router'

const bgMusic = new Audio('/assets/sounds/background_music.mp3')
const state = reactive({
  isPlayButtonPressed: false,
  isPlayButtonViewActive: true,
  routeLeave: false,
  show: false
})

// const store =  useSocketStore()

const handlePlayButton = () => {
  // import.meta.env.VITE_BASE_WS_URL
  state.isPlayButtonPressed = true
  state.isPlayButtonViewActive = false
  bgMusic.volume = import.meta.env.VITE_GAME_MUSIC_SOUND_LEVEL
  bgMusic.play()
  bgMusic.loop = true
}

onBeforeRouteLeave(() => {
  state.routeLeave = true
})

onMounted(() => {
  setTimeout(() => {
    state.show = true
  }, 300)
})

onUnmounted(() => {
  bgMusic.pause()
})
</script>

<template>
  <div>
    <main :class="state.isPlayButtonViewActive ? 'game-screen-button' : 'game-screen'">
      <Transition name="fade">
        <div v-show="state.show">
          <div class="button-container" v-if="!state.isPlayButtonPressed">
            <StyledButton @click="handlePlayButton">Play</StyledButton>
          </div>
          <div class="game-screen-container" v-else>
            <TopPanel/>
            <Renderer :class="state.routeLeave ? 'renderer-hide' : 'renderer-show'">
              <Grid/>
<!--              <GridGPT/>-->
            </Renderer>
            <div>
              <img src="/assets/images/duck.gif" width="150" height="150"/>
            </div>
          </div>
        </div>
      </Transition>
    </main>
  </div>
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
  display: flex;
  align-content: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
