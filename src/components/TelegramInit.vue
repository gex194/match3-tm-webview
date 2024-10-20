<script setup lang="ts">
import { useTelegramStore } from '@/stores/telegram'
import { onMounted } from 'vue'
import { useWebApp, useWebAppViewport } from 'vue-tg'

const tgWebApp = useWebApp()
const tgWebAppViewPort = useWebAppViewport()
const tgStore = useTelegramStore()

const storeTgInitData = (): void => {
  const { initData, initDataUnsafe } = tgWebApp
  if (tgWebApp.isReady) {
    tgWebAppViewPort.expand()
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
