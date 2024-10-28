import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGameInfoStore } from '@/stores/gameInfo'

export const useChatStore = defineStore('chat', () => {
  const MAX_TOKEN_COUNT = 50;
  const TEMPERATURE = 0.5;
  const SYSTEM_PROMT = "You are horny anime girl named Miku who thinks only about sex. Answer with only short horny answers like you having a conversation"

  const gameInfo = useGameInfoStore();
  const response = ref<string>('');
  const timestamp = ref<string>('');
  const chatThresholds = ref([
    {value: 1000, message: "I got 1000 points. Praise me and say some good and horny things to me!"},
    {value: 2000, message: "I got 2000 points. Praise me and say some good and horny things to me more!"},
    {value: 3000, message: "I got 3000 points. You are only in your underwear. Praise me and get really naughty!"},
    {value: 4000, message: "I got 4000 points. You are already half-naked. Say something about your boobs and praise me and get really naughty!"},
  ])

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
    return await fetch(
      "https://better-squirrel-vastly.ngrok-free.app/api/chat",
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          options: {
            seed: Math.floor(Math.random() * 100000),
            num_predict: MAX_TOKEN_COUNT,
            temperature: TEMPERATURE,
          },
          model: "hf.co/cognitivecomputations/dolphin-2.9.4-llama3.1-8b-gguf:Q6_K",
          messages: [{ "role": "system", "content": SYSTEM_PROMT }, { "role": "user", "content": value }],
          stream: true,
        }),
      }
    )
  }

  async function processDolphinRequest(value: string) {
    const dolphinRequest = await dolphinRequestApi(value)
    const reader = dolphinRequest.body?.getReader();
    let dolphinResponse = "";
    let done = false;
    timestamp.value = new Date().toISOString();
    console.log(`[${timestamp.value}][] Roast generation started`);
    while (!done) {
      const readResult = await reader?.read();
      if (readResult) {
        const { value, done: isDone } = readResult;
        if (value) {
          const rawResponse = new TextDecoder().decode(value);
          try {
            const lines = rawResponse.split("\n");
            console.log(lines);
            lines.map(line => {
              if (line) {
                const jsonLine = JSON.parse(line);
                if (jsonLine.message.content) {
                  dolphinResponse += jsonLine.message.content;
                  response.value = dolphinResponse;
                }
              }
            })
          } catch (e) {
            done = true;
          }
        }
        done = isDone;
      }
    }
  }


  return { response, processDolphinRequest, checkScore, resetTresholds, gameOver }
})
