import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameInfoStore = defineStore('gameInfo', () => {
  const score = ref(0)
  const time = ref(0)
  const leaderboard = ref(null)
  function setScore(value) {
    score.value = value
  }

  function setTime(value) {
    time.value = value / 1000000000
  }

  function setLeaderboard(value) {
    leaderboard.value = value
  }

  return { score, time, leaderboard, setScore, setTime, setLeaderboard }
})
