import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTelegramStore = defineStore('telegram', () => {
  const tgInitData = ref<Object | null>(null)
  const tgUser = ref<Object | null>(null)
  const tgUserId = ref<String>('')
  const setInitData = (data: Object) => {
    tgInitData.value = data
  }

  const setTgUser = (user: Object) => {
    tgUser.value = user
    tgUserId.value = user?.id
  }

  return { tgInitData, tgUser, tgUserId, setInitData, setTgUser }
})
