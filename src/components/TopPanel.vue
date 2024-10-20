<script setup lang="ts">
import { useGameInfoStore } from '@/stores/gameInfo'
import { useSocketStore } from '@/stores/socket'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const gameInfo = useGameInfoStore()
const socketStore = useSocketStore()

const timer = ref<number>(20)

const countDownTimer = (): void => {
  if (timer.value > 0) {
    setTimeout(() => {
      timer.value -= 1
      countDownTimer()
    }, 1000)
  } else {
    socketStore.finishGameRequest()
    router.push('/result')
  }
}

watch(
  () => gameInfo.time,
  () => {
    timer.value = gameInfo.time
    countDownTimer()
  }
)
</script>

<template>
  <div class="main-container container">
    <div class="score">
      <span class="roksana-text score-title">Score</span>
      <span class="gameria-text score-value">{{ gameInfo.score }}</span>
    </div>
    <div class="time">
      <span class="roksana-text time-title">Time</span>
      <span class="gameria-text time-value">{{ timer }}</span>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 10px;
  margin-left: 10px;
  gap: 10px;
}

.score,
.time {
  padding: 10px;
  display: flex;
  line-height: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.score-title,
.time-title {
  font-size: 54px;
}

.score-value,
.time-value {
  font-size: 45px;
}
</style>
