import { ref } from 'vue'
import { defineStore } from 'pinia'
import { generateRequestID } from '@/helpers/websocket-cli'
import { useTelegramStore } from './telegram'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref<WebSocket | null>(null)
  const session_id = ref<string | null>('')
  const tgStore = useTelegramStore()

  const openWebSocketConnection = () => {
    socket.value = new WebSocket('ws://localhost:3032/ws?' + tgStore.tgInitData)

    socket.value.addEventListener('open', (event: Event) => {
      console.log('Connected to webSocket server')
      console.log(socket)
    })

    socket.value.addEventListener('message', (event: MessageEvent<any>) => {
      console.log('Message recieved', event)
      try {
        const response = JSON.parse(event.data)
        console.log('response data', response.data)

        if (response.path == '/game/start_game') {
          session_id.value = response.data.session_id
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
      telegram_id: tgStore.tgUser?.id
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
        player_id: '1'
      }
    }

    sendWebSocketRequest(request)
  }

  const closeWebSocketConnection = () => {
    socket.value?.close()
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
    closeWebSocketConnection
  }
})
