<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore();
const inputValue = ref<string>('');

const handleInput = (event: any) => {
  inputValue.value = event.target.value;
}

const handleSend = () => {
  chatStore.processDolphinRequest(inputValue.value)
}
</script>

<template>
  <div class="chat-container">
    <div name="messages" class="messages-container">
      <span class="messages-text">{{chatStore.response}}</span>/
    </div>
    <div class="chat-interaction-container">
      <input class="chat-input" @input="handleInput" />
      <button class="chat-button" @click="handleSend">Send</button>
    </div>

  </div>
</template>

<style scoped>
.chat-container {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
  background-color: #ffbfda;
  border-radius: 20px;
}

.messages-container {
  border-radius: 20px;
  padding: 5px;
  padding-left: 10px;
  color: white;
  background-color: #ff93c2;
  overflow-y: auto;
  height: 140px;
}

.messages-text {
  font-family: "HornyVillage";
  font-size: 19px;
}

.chat-interaction-container {
  display: inline-flex;
  justify-content: space-between;
  gap: 10px;
}


.chat-input {
  width: 100%;
  padding-left: 10px;
  border-radius: 20px;
  height: 30px;
  border-color: pink;
  font-family: "HornyVillage";
}
.chat-button {
  border-radius: 20px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #ff93c2;
  font-size: 15px;
  color: white;
  border: none;
  font-family: "HornyVillage";
}
</style>