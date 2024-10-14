<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import { onMounted } from 'vue'
import { useWebApp } from 'vue-tg'
const tgWebApp = useWebApp()
const tgStore = useTelegramStore()

const storeTgInitData = () => {
  const { initData, initDataUnsafe } = tgWebApp
  if (tgWebApp.isReady) {
    tgStore.setInitData(initData)
    tgStore.setTgUser(initDataUnsafe.user)
  }
}

onMounted(() => {
  tgWebApp.ready()
  storeTgInitData()
})
console.log('initData', tgWebApp)
</script>

<template>
  <div></div>
</template>
