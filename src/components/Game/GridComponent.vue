<script setup lang="ts">
import { useGameInfoStore } from '@/stores/GameInfo'
import { useSocketStore } from '@/stores/socket'
import { reactive, onMounted, onBeforeMount, toRaw, onUnmounted } from 'vue'
import { Loader, onTick } from 'vue3-pixi'

const state = reactive({
  sprites: [] as any[],
  selected: null as any | null,
  selectedBuffer: null as any | null,
  nextSelected: null as any | null,
  nextSelectedBuffer: null as any | null,
  gameState: null as GameState | null,
  matches: [] as any[],
  newCells: [] as any[],
  deleted: false as Boolean,
  isMoveSuccessfull: false as Boolean,
  animationTextures: [] as any[]
})

const socketStore = useSocketStore()
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

const initAnimationSpriteTextures = () => {
  for (let x = 0; x < 17; x++) {
    state.animationTextures.push(`frame_0${x}_delay-0.04s.png`)
  }
}

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
      socketStore.moveRequest(from, to)
    } else {
      state.selected.scale = { x: SCALE_X, y: SCALE_Y }
      state.selected = null
      state.selectedBuffer = null
    }
  }
}

const onGameStart = (response) => {
  state.gameState = response.data as GameState
  gameInfo.setTime(state.gameState.duration)
  hydrateGrid()
}

const onGameMove = (response) => {
  const randomIndex = Math.floor(Math.random() * 6)
  console.log('reponseMoveMatches', response.data.matches)
  const moveSound = new Audio(sounds[randomIndex])
  moveSound.volume = 0.4
  state.gameState = response.data as GameState
  state.matches = response.data.matches
  state.newCells = response.data.new_cells
  state.isMoveSuccessfull = true
  gameInfo.setScore(state.gameState.score)
  moveSound.play()
}

const initializeWebSocketHandler = () => {
  socketStore.socket?.addEventListener('message', (event: MessageEvent<any>) => {
    try {
      const response = JSON.parse(event.data)
      console.log('response from ws', response)
      console.log('event from message ws', event)
      if (response.path == '/game/start_game') {
        console.log('HUI')
        onGameStart(response)
      }

      if (response.path == '/game/move') {
        onGameMove(response)
      }

      console.log('vue state gameState', state.gameState)
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })
}

const shrinkDeletedCells = () => {
  let result = false
  state.matches.forEach((match) => {
    match.cells.forEach((matchCell) => {
      state.sprites.forEach((sprite) => {
        if (sprite.id == matchCell.id && sprite.scale.x > 0) {
          sprite.scale.x = 0
          sprite.scale.y = 0

          // sprite.scale.x -= 0.02
          // sprite.scale.y -= 0.02
          if (sprite.scale.x <= 0 && sprite.scale.y <= 0) {
            result = true
          }
        }
      })
    })
  })
  if (result) {
    console.log('shrinked')
    setTimeout(() => {
      state.deleted = true
      state.matches = []
    }, 490)
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
  socketStore.startGameRequest()
})

onBeforeMount(() => {
  initAnimationSpriteTextures()
  initializeWebSocketHandler()
})

onUnmounted(() => {
  socketStore.closeWebSocketConnection()
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
  <Loader :resources="['/assets/animation_data/explosion_data_file.json']">
    <Container>
      <animated-sprite
        v-for="match in state.newCells"
        :key="match.id"
        :textures="state.animationTextures"
        :playing="!state.isMoveSuccessfull"
        :loop="false"
        :animation-speed="0.45"
        :anchor="0.5"
        :x="mapGridPositionToLocalCanvas(match.position.row, SPRITE_WIDTH) + 10"
        :y="mapGridPositionToLocalCanvas(match.position.col, SPRITE_HEIGHT)"
        :scale="0.3"
        :z-index="1"
      />
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
        :z-index="0"
      />
    </Container>
  </Loader>
</template>
<style scoped></style>
