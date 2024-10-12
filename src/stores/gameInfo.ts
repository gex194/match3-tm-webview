import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameInfoStore = defineStore('gameInfo', () => {
  const score = ref(0)
  const time = ref(0)
  function setScore(value) {
    score.value = value
  }

  function setTime(value) {
    time.value = value
  }

  return { score, time, setScore, setTime }
})
