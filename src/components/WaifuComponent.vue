<script setup lang="ts">

import { onBeforeMount, ref, watch } from 'vue'
import { useGameInfoStore } from '@/stores/gameInfo'
import ChatComponent from '@/components/ChatComponent.vue'

const imageSources = [
  '/assets/images/waifu_score/transparent/5.png',
  '/assets/images/waifu_score/transparent/4.png',
  '/assets/images/waifu_score/transparent/3.png',
  '/assets/images/waifu_score/transparent/2.png',
  '/assets/images/waifu_score/transparent/1.png',
]
const gameInfo = useGameInfoStore();

const imageSrc = ref<string>('')
const scoreImageMap = ref<Array<WaifuImage>>([])

const setImage = (score: number) => {
  const image = scoreImageMap.value.find(img => score >= img.score);
  if (image) {
    imageSrc.value = image.src;
  }
}

const preloadImages = () => {
  let initialScore = 5000;
  imageSources.forEach((source) => {
    const image = new Image();
    image.src = source;
    let imageData: WaifuImage = {
      score: initialScore -= 1000,
      src: image.src
    }
    scoreImageMap.value.push(imageData);
  })
  setImage(gameInfo.score);
}

watch(() => gameInfo.score, (newScore) => {
  setImage(newScore)
})

onBeforeMount(() => {
  preloadImages()
})
</script>

<template>
  <div class="waifu-container">
    <Transition name="fade" mode="out-in">
      <img class="waifu-img" :key="imageSrc" :src="imageSrc" alt="waifu"/>
    </Transition>
    <ChatComponent />
  </div>
</template>

<style scoped>
.waifu-container {
  flex-direction: column;
}
.waifu-img {
  max-height: 560px;
  width: 100%;
}
</style>