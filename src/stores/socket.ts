import type { PositionGrid } from '@/types/PositionGrid'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { generateRequestID } from '@/helpers/websocket-cli'
import { useTelegramStore } from './telegram'
import { useGameInfoStore } from './gameInfo'

export const useSocketStore = defineStore('socket', () => {
  const tgStore = useTelegramStore()
  const gameInfo = useGameInfoStore()

  const socket = ref<WebSocket | null>(null)
  const session_id = ref<string | null>('')
  const wallet = ref<string>('')
  const baseWsUrl = tgStore.tgInitData ? import.meta.env.VITE_BASE_WS_URL : import.meta.env.VITE_BASE_WS_BROWSER_URL

  function initClientId() {
    let newClientId = '';
    if (!localStorage.getItem("clientId")) {
      newClientId = `${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem("clientId", newClientId);
      return newClientId;
    }
    else {
      return localStorage.getItem("clientId")
    }
  }

  const openWebSocketConnection = () => {
    const params = tgStore.tgInitData ? tgStore.tgInitData :`?client_id=${initClientId()}`
    socket.value = new WebSocket(baseWsUrl + params)

    socket.value.addEventListener('open', (event: Event) => {
    })

    socket.value.onerror = (ev: Event) => {
      console.error('ERROR', ev)
    }

    socket.value.addEventListener('message', (event: MessageEvent<any>) => {
      try {
        const response = JSON.parse(event.data)

        if (response.path == '/game/start_game') {
          session_id.value = response.data.session_id
        }

        if (response.path == '/game/leaderboard') {
          gameInfo.setLeaderboard(response.data)
        }

        if (response.path == '/game/finish_game') {
          wallet.value = response.data.wallet
        }
      } catch (error: any) {
        console.log('Error', error)
      }
    })

    socket.value.onclose = (event: CloseEvent) => {
      console.log('Disconnected from server', event)
    }
  }

  const startGameRequest = () => {
    const requestBody = {
      telegram_id: tgStore.tgUserId,
      client_id: localStorage.getItem("clientId")
    }

    const request = {
      path: '/game/start_game',
      request_id: generateRequestID(),
      body: requestBody
    }

    sendWebSocketRequest(request)
  }

  const moveRequest = (from : PositionGrid, to: PositionGrid) => {
    const request = {
      path: '/game/move',
      request_id: generateRequestID(),
      body: {
        move: {
          from: from,
          to: to
        },
        session_id: session_id.value,
        player_id: tgStore.tgUserId
      }
    }

    sendWebSocketRequest(request)
  }

  const finishGameRequest = () => {
    const request = {
      path: '/game/finish_game',
      request_id: generateRequestID(),
      body: {
        session_id: session_id.value,
        telegram_id: tgStore.tgUserId
      }
    }

    sendWebSocketRequest(request)
  }

  const leaderboardRequest = () => {
    const request = {
      path: '/game/leaderboard',
      request_id: generateRequestID(),
      body: {
        total_leaders: 10
      }
    }

    sendWebSocketRequest(request)
  }

  const updateWalletRequest = (value: string) => {
    const clientId: string | null = localStorage.getItem("clientId")
    const request = {
      path: '/game/update_wallet',
      request_id: generateRequestID(),
      body: {
        client_id: clientId,
        telegram_id: tgStore.tgUserId,
        session_id: session_id.value,
        wallet: value
      }
    }

    sendWebSocketRequest(request)
  }

  const closeWebSocketConnection = () => {
    socket.value?.close()
    gameInfo.score = 0
    gameInfo.time = 0
    session_id.value = ''
    socket.value = null
  }

  const sendWebSocketRequest = (request: Object) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(request))
    }
  }

  return {
    socket,
    session_id,
    wallet,
    initClientId,
    openWebSocketConnection,
    startGameRequest,
    moveRequest,
    finishGameRequest,
    leaderboardRequest,
    updateWalletRequest,
    closeWebSocketConnection
  }
})
