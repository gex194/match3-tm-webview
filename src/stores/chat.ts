import type { Message } from '@/types/Message'

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGameInfoStore } from '@/stores/gameInfo'


export const useChatStore = defineStore('chat', () => {
  const gameInfo = useGameInfoStore();
  const response = ref<string>('');
  const messages = ref<Array<Message>>([])
  const currentTextToSpeech = ref<HTMLAudioElement>(new Audio())
  const baseUrl = import.meta.env.VITE_BASE_HTTP_URL
  const gameStartValues = {message: " I'm Kuroko, a kawaii anime girl, always excited to play some cute games with handsome senpai like you. Just make sure we keep things fun and playful",
    sound: "/assets/sounds/game_start.mp3"}
  const chatThresholds = ref([
    {value: 1000, message: "Ooh, senpai. You starting to make me feel interested in you!", sound: "/assets/sounds/threshold_1.mp3"},
    {value: 2000, message: "Ooh senpai. I'm feeling fortunate to meet you today. Play more, please, play more!", sound: "/assets/sounds/threshold_2.mp3"},
    {value: 3000, message: "Oooh, senpai. I'm feeling wet in my panties, yes, play, play! oh yes", sound: "/assets/sounds/threshold_3.mp3"},
    {value: 4000, message: "Yes senpai, look at my boobs, touch them, feel them. Cum inside me!", sound: "/assets/sounds/threshold_4.mp3"},
  ])

  function initClientId() {
    if (!localStorage.getItem("clientId")) {
      localStorage.setItem("clientId", `client_${Math.random().toString(36).substring(2, 15)}`);
    }
  }

  function setMessageAndSound(message: string, soundSrc: string) {
    response.value = message;
    setSound(soundSrc)
  }

  function setSound(soundSrc: string) {
    currentTextToSpeech.value.pause()
    currentTextToSpeech.value.currentTime = 0;
    currentTextToSpeech.value = new Audio(soundSrc)
    currentTextToSpeech.value.volume = 0.5
    currentTextToSpeech.value.play();
  }

  function startGameMessageAndSound() {
    setMessageAndSound(gameStartValues.message, gameStartValues.sound)
  }

  async function checkScore() {
    const threshold = chatThresholds.value.find(x => gameInfo.score >= x.value)
    if (threshold) {
      setMessageAndSound(threshold.message, threshold.sound)
      chatThresholds.value.shift();
    }
  }

  async function gameOver() {
    await processDolphinRequest("Game is over. Tell me how good I am, but i can be better at the game if i try good enough");
    resetTresholds()
  }

  function resetTresholds() {
    chatThresholds.value = [
      {value: 1000, message: "Ooh, senpai. You starting to make me feel interested in you!", sound: "/assets/sounds/threshold_1.mp3"},
      {value: 2000, message: "Ooh senpai. I'm feeling fortunate to meet you today. Play more, please, play more!", sound: "/assets/sounds/threshold_2.mp3"},
      {value: 3000, message: "Oooh, senpai. I'm feeling wet in my panties, yes, play, play! oh yes", sound: "/assets/sounds/threshold_3.mp3"},
      {value: 4000, message: "Yes senpai, look at my boobs, touch them, feel them. Cum inside me!", sound: "/assets/sounds/threshold_4.mp3"},
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
      baseUrl + "api/send-message",
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
    setSound(URL.createObjectURL(audioBlob))
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


  return { response, processDolphinRequest, checkScore, initClientId, gameOver, startGameMessageAndSound }
})
