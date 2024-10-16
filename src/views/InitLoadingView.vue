<script setup lang="ts">
import TelegramInit from '@/components/TelegramInit.vue'
import { useSocketStore } from '@/stores/socket'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const socketStore = useSocketStore()
const router = useRouter()

const onOpenSocketHandler = () => {
  socketStore.socket?.addEventListener('open', () => {
    router.push('/game')
  })
}

onMounted(() => {
  socketStore.openWebSocketConnection()
  onOpenSocketHandler()
})
</script>
<template>
  <div class="container">
    <TelegramInit />
    <div>
      <img class="beat" src="/assets/images/logo.png" width="400" />
    </div>
    <div class="gameria-text loading-text">Loading</div>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.loading-text {
  font-size: 50px;
}

.bounce {
  animation: bounce 2s cubic-bezier(0.39, 0.575, 0.565, 1) infinite;
  transform: translate3d(0, 0, 0);
}

.beat {
  animation: beat 2s cubic-bezier(0.39, 0.575, 0.565, 1) infinite;
  transform: rotate3d(0, 0, 0);
}

@keyframes bounce {
  10%,
  90% {
    transform: translate3d(0, -1px, 0);
  }

  20%,
  80% {
    transform: translate3d(0, 2px, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(0, -4px, 0);
  }

  40%,
  60% {
    transform: translate3d(0, 4px, 0);
  }
}

@keyframes beat {
  10%,
  90% {
    transform: scale(0.95);
  }

  20%,
  80% {
    transform: scale(1);
  }
}
</style>
