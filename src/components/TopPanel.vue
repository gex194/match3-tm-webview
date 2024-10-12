<script setup lang="ts">
import { useGameInfoStore } from '@/stores/GameInfo'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const timer = ref(0)

const gameInfo = useGameInfoStore()

const countDownTimer = () => {
  if (timer.value > 0) {
    setTimeout(() => {
      timer.value -= 1
      countDownTimer()
    }, 1000)
  } else {
    router.push('/result')
  }
}

onMounted(() => {
  timer.value = gameInfo.time
})
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 10px;
  margin-left: 10px;
  gap: 150px;
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
