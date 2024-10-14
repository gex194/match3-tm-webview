<script setup lang="ts">
import StyledButton from '@/components/StyledButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClose = () => {
  router.push('/')
}
</script>

<template>
  <div class="container">
    <div class="logo-container">
      <img class="logo" src="/assets/images/logo.png" />
    </div>
    <div class="top-title-container">
      <span class="gameria-text top-title">TOP PLAYERS</span>
    </div>
    <div name="leaderboard" class="leaderboard-container main-container">
      <ul>
        <li class="gameria-text leaderboard-content">
          <div class="leaderboard-position">1</div>
          <div class="leaderboard-score">123321</div>
          <div class="leaderboard-name">Test 1</div>
        </li>
        <li class="gameria-text leaderboard-content">
          <div class="leaderboard-position">1</div>
          <div class="leaderboard-score">123322221</div>
          <div class="leaderboard-name">Te42424242</div>
        </li>
      </ul>
    </div>
    <div class="button-container">
      <StyledButton @click="handleClose">Close</StyledButton>
    </div>
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
