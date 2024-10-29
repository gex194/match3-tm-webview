<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameInfoStore } from '@/stores/gameInfo'

const gameInfo = useGameInfoStore();
const progress = ref<number>(0)
const maxLoveMeterScore = 4000
const makeProgress = (score: number) => {
  if (score >= maxLoveMeterScore) {
    progress.value = 100;
  } else {
    progress.value = (score/maxLoveMeterScore) * 100;
  }
}

watch(() => gameInfo.score,
  (score) => {makeProgress(score)})
</script>

<template>
  <div class="progress-container">
    <div>
      <span class="progress-title roksana-text">Love meter</span>
    </div>
    <div class="shell">
      <div class="bar" :style="{ width: progress + '%' }">
        <span class="bar--text" v-show="progress !== 0">{{ Math.floor(progress) }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: rgba(253, 142, 188, 0.5);
  border-radius: 15px;
  width: 100%;
}
.progress-title {
  font-size: 5em;
  color: white;
}
.shell {
  transition: width 0.1s;
  height: 48px;
  width: 100%;
  border: 2px solid white;
  border-radius: 23px;
  padding: 3px;
}

.bar {
  background: linear-gradient(to right, #2959ff, #ff0000);
  height: 40px;
  width: 15px;
  border-radius: 19px;
  transition: width 0.5s ease-in-out;
  display: flex;
  justify-content: center;
}

.bar--text {
  position: absolute;
  left: 0;
  right: 0;
  font-family: "HornyVillage",serif;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
  padding: 4px 5px;
  color: #fff;
  font-size: 2em;
  height: 40px;
}

button {
  margin: 10px;
  border: 1px solid #aaa;
  background: none;
  border-radius: 50%;
  padding: 5px 8px;
  outline: none;
  cursor: pointer;
}
</style>