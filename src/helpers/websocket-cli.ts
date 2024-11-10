let socket
export const openWebSocketConnection = () => {
  socket = new WebSocket('ws://localhost:3032/ws')

  socket.onopen = function () {
    console.log(socket)
  }

  socket.onmessage = function (event: MessageEvent<any>) {
    console.log('Message recieved')
  }

  socket.onclose = function (event) {
    console.log('Disconnected from server', event)
    // Реализация повторного подключения через 3 секунды
    // setTimeout(function() {
    //     console.log('Reconnecting to server...');
    //     connectWebSocket();
    // }, 3000);
  }

  socket.onerror = function (error) {
    console.error('WebSocket error:', error)
  }
  return socket
}

export const dropWebsocketConnection = () => {
  socket.close()
}

export const sendWebSocketRequest = (request: any) => {
  console.log('sendWebSocketRequest Sending request:', request)
  // Убедитесь, что WebSocket соединение установлено перед отправкой сообщения
  if (socket.readyState === WebSocket.OPEN) {
    // clearError();  // Очищаем ошибки перед отправкой запроса
    socket.send(JSON.stringify(request))
  } else {
    console.log('WebSocket connection is not open. Cannot send move.')
  }
}

export const onWebsocketMesssage = (event: MessageEvent<any>) => {
  try {
    const response = JSON.parse(event.data)
    console.log('Received response from server:', response)

    // Обработка ответа на старт игры
    if (response.path === '/game/start_game') {
      const gameState = response.data

      // Проверяем, что у gameState есть board
      if (gameState && gameState.board && gameState.board.grid) {
        console.log('Game state updated:', gameState)
      } else {
        console.error('Invalid game state received:', gameState)
      }

      return gameState
    }
    // Обработка ответа на ход игрока
    else if (response.path === '/game/move') {
      const gameMove = response.data
      console.log('Move response:', gameMove)
      return gameMove

      // Обновляем игровое поле с новым состоянием
    }
  } catch (error) {
    console.error('Error parsing message:', error)
  }
}

export function generateRequestID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
