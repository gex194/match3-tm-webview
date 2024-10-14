<script setup lang="ts">
import { generateRequestID, openWebSocketConnection } from '@/helpers/websocket-cli'
import { useGameInfoStore } from '@/stores/GameInfo'
import { reactive, onMounted, onBeforeMount, toRaw, onUnmounted } from 'vue'
import { onTick } from 'vue3-pixi'

const state = reactive({
  sprites: [] as any[],
  selected: null as any | null,
  selectedBuffer: null as any | null,
  nextSelected: null as any | null,
  nextSelectedBuffer: null as any | null,
  socket: null as WebSocket | null,
  gameState: null as GameState | null,
  matches: [] as any[],
  deleted: false as Boolean,
  isMoveSuccessfull: false as Boolean
})

const gameInfo = useGameInfoStore()

const SPRITE_WIDTH = 50
const SPRITE_HEIGHT = 54
const SCALE_X = 0.45
const SCALE_Y = 0.45

const sounds = [
  '/assets/sounds/move1.mp3',
  '/assets/sounds/move2.mp3',
  '/assets/sounds/move3.mp3',
  '/assets/sounds/move4.mp3',
  '/assets/sounds/move5.mp3',
  '/assets/sounds/move6.mp3'
]

const mapGridPositionToLocalCanvas = (value, constant) => {
  return value * constant + constant / 2
}

const hydrateGrid = () => {
  const { board } = state.gameState
  const { grid } = board
  state.sprites = []
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let spriteData: any = {
        id: grid[x][y].id,
        name: grid[x][y].type,
        anchor: { x: 0.5, y: 0.5 },
        isNew: grid[x][y].is_new,
        position: {
          x: mapGridPositionToLocalCanvas(grid[x][y].position.row, SPRITE_WIDTH),
          y: mapGridPositionToLocalCanvas(grid[x][y].position.col, SPRITE_HEIGHT)
        },
        positionGrid: grid[x][y].position,
        texture: `/assets/images/hearts/${grid[x][y].type}.png`,
        scale: { x: SCALE_X, y: SCALE_Y }
      }
      state.sprites.push(spriteData)
    }
  }
}

const handleClick = (event: any) => {
  let from
  let to
  const element = event.currentTarget
  if (!state.selected) {
    state.selected = element
    state.selectedBuffer = {
      position: {
        x: element.position.x,
        y: element.position.y
      }
    }
  } else {
    if (element !== state.selected) {
      state.nextSelected = element
      state.nextSelectedBuffer = {
        position: {
          x: element.position.x,
          y: element.position.y
        }
      }
      from = toRaw(state.selected.positionGrid)
      to = toRaw(element.positionGrid)
      moveHeartRequest(from, to)
    } else {
      state.selected.scale = { x: SCALE_X, y: SCALE_Y }
      state.selected = null
      state.selectedBuffer = null
    }
  }
}

const initializeWebSocketConnection = () => {
  state.socket = openWebSocketConnection()
  state.socket.onopen = (event) => {
    startGameRequest()
  }
  state.socket.onmessage = (event) => {
    try {
      const response = JSON.parse(event.data)
      console.log('response from ws', response)
      console.log('event from message ws', event)
      if (response.path == '/game/start_game') {
        state.gameState = response.data as GameState
        gameInfo.setTime(state.gameState.duration)
        hydrateGrid()
      }

      if (response.path == '/game/move') {
        const randomIndex = Math.floor(Math.random() * 6)
        console.log('reponseMoveMatches', response.data.matches)
        const moveSound = new Audio(sounds[randomIndex])
        moveSound.volume = 0.4
        state.gameState = response.data as GameState
        state.matches = response.data.matches
        state.isMoveSuccessfull = true
        gameInfo.setScore(state.gameState.score)
        moveSound.play()
      }

      console.log('vue state gameState', state.gameState)
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  }
}

const startGameRequest = () => {
  const requestBody = {
    telegram_id: 123
  }

  const request = {
    path: '/game/start_game',
    request_id: generateRequestID(),
    body: requestBody
  }

  sendWebSocketRequest(request)
}

const moveHeartRequest = (from, to) => {
  const request = {
    path: '/game/move',
    request_id: generateRequestID(),
    body: {
      move: {
        from: from,
        to: to
      },
      session_id: state.gameState?.session_id,
      player_id: '1'
    }
  }

  sendWebSocketRequest(request)
}

const sendWebSocketRequest = (request: Object) => {
  console.log('sendWebSocketRequest Sending request:', request)
  // Убедитесь, что WebSocket соединение установлено перед отправкой сообщения
  if (state.socket && state.socket.readyState === WebSocket.OPEN) {
    // clearError();  // Очищаем ошибки перед отправкой запроса
    state.socket.send(JSON.stringify(request))
  } else {
    console.log('WebSocket connection is not open. Cannot send move.')
  }
}

const shrinkDeletedCells = () => {
  let result = false
  state.matches.forEach((match) => {
    match.cells.forEach((matchCell) => {
      state.sprites.forEach((sprite) => {
        if (sprite.id == matchCell.id && sprite.scale.x > 0) {
          sprite.scale.x -= 0.015
          sprite.scale.y -= 0.015
          if (sprite.scale.x <= 0 && sprite.scale.y <= 0) {
            result = true
          }
        }
      })
    })
  })
  if (result) {
    console.log('shrinked')
    state.deleted = true
    state.matches = []
  }
}

function animationStateMachine(speed: number) {
  if (state.selected.position.x < state.nextSelectedBuffer.position.x) {
    console.log(state.nextSelectedBuffer.position.x)
    state.selected.position.x += speed
  }
  if (state.nextSelected.position.x < state.selectedBuffer.position.x) {
    state.nextSelected.position.x += speed
  }
  //Right to Left
  if (state.selected.position.x > state.nextSelectedBuffer.position.x) {
    state.selected.position.x -= speed
  }
  if (state.nextSelected.position.x > state.selectedBuffer.position.x) {
    state.nextSelected.position.x -= speed
  }
  //Bottom to Up
  if (state.selected.position.y < state.nextSelectedBuffer.position.y) {
    state.selected.position.y += speed
  }
  if (state.nextSelected.position.y < state.selectedBuffer.position.y) {
    state.nextSelected.position.y += speed
  }

  //Up to Bottom
  if (state.selected.position.y > state.nextSelectedBuffer.position.y) {
    state.selected.position.y -= speed
  }
  if (state.nextSelected.position.y > state.selectedBuffer.position.y) {
    state.nextSelected.position.y -= speed
  }

  if (
    state.selected.position.x == state.nextSelectedBuffer.position.x &&
    state.selected.position.y == state.nextSelectedBuffer.position.y
  ) {
    state.selected = null
    state.nextSelected = null
    state.isMoveSuccessfull = false
  }
}

onMounted(() => {
  // hydrateGrid()
})

onBeforeMount(() => {
  initializeWebSocketConnection()
})

onUnmounted(() => {
  state.socket?.close()
})

onTick(() => {
  if (state.matches.length > 0 && state.isMoveSuccessfull == false) {
    shrinkDeletedCells()
  }

  if (state.deleted == true) {
    hydrateGrid()
    state.deleted = false
  }

  if (state.isMoveSuccessfull == true && state.selected && state.nextSelected) {
    animationStateMachine(2)
  }

  if (state.selected) {
    const scale = 0.5 + 0.1 * Math.sin(Date.now() / 100)
    state.selected.scale.x = scale
    state.selected.scale.y = scale
  }
})
</script>
<template>
  <sprite
    v-for="sprite in state.sprites"
    :key="sprite.id"
    @mousedown="handleClick"
    @touchstart="handleClick"
    event-mode="dynamic"
    :button-mode="true"
    :scale-x="sprite.scale.x"
    :scale-y="sprite.scale.y"
    :position-x="sprite.position.x"
    :position-y="sprite.position.y"
    :anchor-x="sprite.anchor.x"
    :anchor-y="sprite.anchor.y"
    :texture="sprite.texture"
    :name="sprite.name"
    :positionGrid="sprite.positionGrid"
  />
</template>
<style scoped></style>
