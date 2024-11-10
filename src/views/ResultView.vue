<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StyledButton from '@/components/StyledButton.vue'
import { useGameInfoStore } from '@/stores/gameInfo'
import { useSocketStore } from '@/stores/socket'
import WaifuComponent from '@/components/WaifuComponent.vue'
import ChatComponent from '@/components/ChatComponent.vue'
import { useChatStore } from '@/stores/chat'
import SocialsComponent from '@/components/SocialsComponent.vue'

const show = ref<boolean>(false)
const inputValue = ref<string>('wallet address')
const errorText = ref<string>('')
const error = ref<boolean>(false)
const router = useRouter()
const gameInfo = useGameInfoStore()
const socketStore = useSocketStore()
const chatStore = useChatStore();

const handleSubmit = (): void => {
  socketStore.updateWalletRequest(inputValue.value)
}

const handleClose = (): void => {
  socketStore.closeWebSocketConnection()
  show.value = false
  setTimeout(() => {
    router.push('/')
  }, 700)
}

const socketErrorHandler = (): void => {
  socketStore.socket?.addEventListener('message', (event) => {
    try {
      const response = JSON.parse(event.data)
      if (response.path == '/game/update_wallet' && response.code == 500) {
        error.value = true
        errorText.value = response.error
      }

      if (response.path == '/game/update_wallet' && response.status == 200) {
        error.value = false
        errorText.value = ''
        router.push({ name: 'leaderboard' })
      }
    } catch (error: any) {
      console.log('Error', error)
    }
  })
}

const handleInput = (e): void => {
  inputValue.value = e.target.value
  error.value = false
  errorText.value = ''
}

onMounted(() => {
  inputValue.value = socketStore.wallet
  setTimeout(() => {
    show.value = true
    chatStore.gameOver()
  }, 700)
  socketErrorHandler()
})
</script>

<template>
  <div>
    <Transition name="fade">
      <div class="result-container" v-show="show">
        <div class="waifu-container">
          <img class="waifu-img" src="/assets/images/waifu-result-screen.png" />
        </div>
        <div class="logo-container">
          <img class="logo" src="/assets/images/logo.png" />
        </div>
        <div class="result-content">
          <div class="result-content--waifu"><WaifuComponent /></div>
          <div class="result-content--chat">
            <ChatComponent />
            <SocialsComponent /></div>
          <div class="result-content--form">
            <div name="result-block" class="result-block">
              <div class="time-result">
                <span class="roksana-text time-title">Time</span>
                <span class="gameria-text time-value">{{ gameInfo.time }}</span>
              </div>
              <div class="score-result">
                <span class="roksana-text score-title">Score</span>
                <span class="gameria-text score-value">{{ gameInfo.score }}</span>
              </div>
            </div>
            <div name="result-personal" class="input-container">
              <span></span>
              <label for="wallet" class="error">&nbsp;{{ errorText }}</label>
              <input
                id="wallet"
                class="result-personal-input"
                :class="errorText ? 'input-error' : ''"
                type="text"
                :value="inputValue"
                @input="handleInput"
              />
            </div>
            <div class="buttons-container">
              <StyledButton @click="handleSubmit">Submit</StyledButton>
              <StyledButton @click="handleClose">Retry</StyledButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.result-content--waifu {
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content--chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.result-content--form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-content: center;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.result-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  flex-direction: row;
  justify-content: center;
}
.buttons-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.hidden {
  visibility: hidden;
}

.unhidden {
  visibility: visible;
}
.result-block {
  display: flex;
  flex-direction: column;
}
.error {
  position: relative;
  color: red;
  font-size: 20px;
  font-weight: 600;
  text-shadow: rgb(255, 255, 255) 1px 0 20px;
  padding: 10px;
}

.input-error {
  border-color: red;
  color: red;
}
.input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.result-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  min-height: 100vh;
  /* background: rgba(255, 255, 255, 1);
  background: radial-gradient(at center, rgba(255, 255, 255, 0.7), rgba(1, 255, 192, 0)); */
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
  width: 20%;
  object-fit: cover;
}
.logo {
  position: absolute;
  width: 200px;
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
  max-width: 380px;
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
