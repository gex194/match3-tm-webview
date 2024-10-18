import { ref } from 'vue'
import { defineStore } from 'pinia'
import { generateRequestID } from '@/helpers/websocket-cli'
import { useTelegramStore } from './telegram'
import { useGameInfoStore } from './gameInfo'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<WebSocket | null>(null)
  const session_id = ref<string | null>('')
  const tgStore = useTelegramStore()
  const gameInfo = useGameInfoStore()
  const baseWsUrl = import.meta.env.VITE_BASE_WS_URL
  const baseWsUrlLocal = 'ws://localhost:3032/ws?'
  const localTgInitData =
    'query_id=AAGkLwkGAAAAAKQvCQbkcRJ5&user=%7B%22id%22%3A101265316%2C%22first_name%22%3A%22Andrei%22%2C%22last_name%22%3A%22Vasilev%22%2C%22username%22%3A%22zest194%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1729268236&hash=a321a1b21b6205a115bba9fdc5907892b58d1eb276a5ac52f07f5c58a3679c33'

  const openWebSocketConnection = () => {
    socket.value = new WebSocket(baseWsUrl + tgStore.tgInitData)

    socket.value.addEventListener('open', (event: Event) => {
      console.log('Connected to webSocket server')
      console.log(socket)
    })

    socket.value.onerror = (ev: Event) => {
      console.error('ERROR', ev)
    }

    socket.value.addEventListener('message', (event: MessageEvent<any>) => {
      console.log('Message recieved', event)
      try {
        const response = JSON.parse(event.data)
        console.log('response data', response.data)

        if (response.path == '/game/start_game') {
          session_id.value = response.data.session_id
        }

        if (response.path == '/game/leaderboard') {
          console.log('leaderboard', response.data)
          gameInfo.setLeaderboard(response.data)
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
      telegram_id: tgStore.tgUserId
    }

    const request = {
      path: '/game/start_game',
      request_id: generateRequestID(),
      body: requestBody
    }

    sendWebSocketRequest(request)
  }

  const moveRequest = (from, to) => {
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
    const request = {
      path: '/game/update_wallet',
      request_id: generateRequestID(),
      body: {
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
    console.log('sendWebSocketRequest Sending request:', request)
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(request))
    } else {
      console.log('WebSocket connection is not open. Cannot send move.')
    }
  }

  return {
    socket,
    session_id,
    openWebSocketConnection,
    startGameRequest,
    moveRequest,
    finishGameRequest,
    leaderboardRequest,
    updateWalletRequest,
    closeWebSocketConnection
  }
})
