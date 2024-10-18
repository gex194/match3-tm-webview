<script setup lang="ts">
import StyledButton from '@/components/StyledButton.vue'
import { useGameInfoStore } from '@/stores/gameInfo'
import { useSocketStore } from '@/stores/socket'
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const socketStore = useSocketStore()
const gameInfo = useGameInfoStore()

const state = reactive({
  show: false
})

const handleClose = () => {
  socketStore.closeWebSocketConnection()
  router.push('/')
}

const shrinkWalletString = (str: string) => {
  return str.substring(0, 5) + '.....' + str.substring(str.length - 5, str.length)
}

onMounted(() => {
  socketStore.leaderboardRequest()
  setTimeout(() => {
    state.show = true
  }, 700)
})
</script>

<template>
  <div>
    <Transition name="fade">
      <div class="container" v-show="state.show">
        <div class="logo-container">
          <img class="logo" src="/assets/images/logo.png" />
        </div>
        <div class="top-title-container">
          <span class="gameria-text top-title">TOP PLAYERS</span>
        </div>
        <div name="leaderboard" class="leaderboard-container main-container">
          <ul v-if="gameInfo.leaderboard">
            <li
              class="gameria-text leaderboard-content"
              v-for="leader in gameInfo.leaderboard.leaders"
              :key="leader.wallet"
            >
              <div class="leaderboard-position">{{ leader.place }}</div>
              <div class="leaderboard-score">{{ leader.score }}</div>
              <div class="leaderboard-name">{{ shrinkWalletString(leader.wallet) }}</div>
            </li>
          </ul>
          <div v-else class="gameria-text">No players in leaderboard :C</div>
        </div>
        <div class="button-container">
          <StyledButton @click="handleClose">Close</StyledButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  gap: 10px;
  background: rgba(255, 255, 255, 1);
  background: radial-gradient(at center, rgba(255, 255, 255, 0.8), rgba(1, 255, 192, 0));
}
.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
}
.button-container {
  display: flex;
  justify-content: center;
}
.logo {
  position: relative;
  width: 200px;
  object-fit: cover;
}
.top-title-container {
  display: flex;
  justify-content: center;
  align-content: center;
}
.top-title {
  font-size: 50px;
}
.leaderboard-container {
  min-height: 65vh;
  padding: 20px;
  margin-right: 20px;
  margin-left: 20px;
}
.leaderboard-content {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  font-size: 25px;
}
.leaderboard-position {
  text-align: start;
}
.leaderboard-score {
  text-align: center;
}
.leaderboard-name {
  text-align: end;
}
</style>
