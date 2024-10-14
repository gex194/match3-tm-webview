<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import StyledButton from '@/components/StyledButton.vue'
import { useGameInfoStore } from '@/stores/GameInfo'

const inputValue = ref('test value')
const router = useRouter()
const gameInfo = useGameInfoStore()

const handleSubmit = () => {
  router.push({ name: 'leaderboard' })
}
</script>

<template>
  <div class="container">
    <div class="waifu-container">
      <img class="waifu-img" src="/assets/images/waifu-result-screen.png" />
    </div>
    <div class="logo-container">
      <img class="logo" src="/assets/images/logo.png" />
    </div>
    <div name="result-block">
      <div class="time-result">
        <span class="roksana-text time-title">Time</span>
        <span class="gameria-text time-value">{{ gameInfo.time }}</span>
      </div>
      <div class="score-result">
        <span class="roksana-text score-title">Score</span>
        <span class="gameria-text score-value">{{ gameInfo.score }}</span>
      </div>
    </div>
    <div name="result-personal">
      <input class="result-personal-input" :value="inputValue" />
    </div>
    <div>
      <StyledButton @click="handleSubmit">Submit</StyledButton>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 1);
  background: radial-gradient(at center, rgba(255, 255, 255, 0.7), rgba(1, 255, 192, 0));
}

.waifu-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.waifu-img {
  width: 55%;
  object-fit: cover;
}
.logo {
  position: absolute;
  width: 400px;
  bottom: 80%;
  object-fit: cover;
}

.result-personal-input {
  text-align: center;
  font-family: 'Gameria';
  font-size: 30px;
  border-radius: 60px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px -59px 67.4px 0px rgba(255, 255, 255, 0.5) inset;
  padding: 15px 15px 15px 15px;
}

.score-title,
.time-title {
  font-size: 64px;
}

.score-value,
.time-value {
  font-size: 64px;
}

.time-result,
.score-result {
  display: flex;
  gap: 50px;
  justify-content: space-between;
  align-items: center;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
