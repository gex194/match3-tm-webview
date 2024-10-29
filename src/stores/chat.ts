import type { Message } from '@/types/Message'

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGameInfoStore } from '@/stores/gameInfo'


export const useChatStore = defineStore('chat', () => {
  const gameInfo = useGameInfoStore();
  const response = ref<string>('');
  const messages = ref<Array<Message>>([])
  const currentTextToSpeech = ref<HTMLAudioElement>(new Audio())
  const chatThresholds = ref([
    {value: 1000, message: "I got 1000 points. Praise me and say some good and horny things to me!"},
    {value: 2000, message: "I got 2000 points. Praise me and say some good and horny things to me more!"},
    {value: 3000, message: "I got 3000 points. You are only in your underwear. Praise me and get really naughty!"},
    {value: 4000, message: "I got 4000 points. You are already half-naked. Say something about your boobs and praise me and get really naughty!"},
  ])

  function initClientId() {
    if (!localStorage.getItem("clientId")) {
      localStorage.setItem("clientId", `client_${Math.random().toString(36).substring(2, 15)}`);
    }
  }

  async function checkScore() {
    const threshold = chatThresholds.value.find(x => gameInfo.score >= x.value)
    if (threshold) {
      await processDolphinRequest(threshold.message);
      chatThresholds.value.shift();
    }
  }

  async function gameOver() {
    await processDolphinRequest("Game is over. Tell me how good I am, but i can be better at the game if i try good enough");
    resetTresholds()
  }

  function resetTresholds() {
    chatThresholds.value = [
      {value: 1000, message: "I got 1000 points. Praise me and say some good and horny things to me!"},
      {value: 2000, message: "I got 2000 points. Praise me and say some good and horny things to me more!"},
      {value: 3000, message: "I got 3000 points. You are only in your underwear. Praise me and get really naughty!"},
      {value: 4000, message: "I got 4000 points. You are already half-naked. Say something about your boobs and praise me and get really naughty!"},
    ]
  }

  async function dolphinRequestApi (value: string) {
    const clientId = localStorage.getItem("clientId");

    messages.value.push({
      role: 'user',
      content: value,
    })

    const body = {
      client_id: clientId,
      messages: messages.value
    }
    return await fetch(
      "http://localhost:3031/api/send-message",
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(body),
      }
    )
  }

  function processAudioRequest(audioBase64: string) {
    console.log("PAUSE PLEASE")
    const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0))
    const audioBlob = new Blob([audioBytes], {type: "audio/mpeg"})
    currentTextToSpeech.value.pause()
    currentTextToSpeech.value.currentTime = 0;
    currentTextToSpeech.value = new Audio(URL.createObjectURL(audioBlob))
    currentTextToSpeech.value.volume = 0.5
    currentTextToSpeech.value.play();
  }

  async function processDolphinRequest(value: string) {
    await dolphinRequestApi(value)
      .then(response => response.json())
      .then(data => {
      messages.value.push({
        role: 'assistant',
        content: data.text
      })
      response.value = data.text;
      processAudioRequest(data.audio);
    })
  }


  return { response, processDolphinRequest, checkScore, initClientId, resetTresholds, gameOver }
})
