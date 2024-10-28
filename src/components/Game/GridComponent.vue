<script setup lang="ts">
import { useGameInfoStore } from '@/stores/gameInfo'
import { useSocketStore } from '@/stores/socket'
import { Rectangle } from 'pixi.js'
import { reactive, onMounted, onBeforeMount, toRaw, watch } from 'vue'
import { Loader, onTick, type SpriteComponent } from 'vue3-pixi'
import { useChatStore } from '@/stores/chat'

const props = defineProps({
  width: Number
})
const socketStore = useSocketStore()
const gameInfo = useGameInfoStore()
const chatStore = useChatStore();

const state = reactive({
  sprites: [] as any[],
  selected: null as any | null,
  selectedBuffer: null as any | null,
  nextSelected: null as any | null,
  nextSelectedBuffer: null as any | null,
  gameState: null as GameState | null,
  matches: [] as any[],
  explosionsArray: [] as any[],
  newCells: [] as any[],
  deleted: false as Boolean,
  isMoveSuccessfull: false as Boolean,
  animationTextures: [] as any[],
  isMoving: false as Boolean,
  animationSpeed: 10 as number,
  deleteDelay: 1000 as number
})

const configState = reactive({
  SPRITE_WIDTH: 50, //50
  SPRITE_HEIGHT: 54, //54
  SCALE_X: 0.45,
  SCALE_Y:0.45,
  sounds: [
    '/assets/sounds/move1.mp3',
    '/assets/sounds/move2.mp3',
    '/assets/sounds/move3.mp3',
    '/assets/sounds/move4.mp3',
    '/assets/sounds/move5.mp3',
    '/assets/sounds/move6.mp3'
  ]
})

watch(() => props.width, (value) => {
  initSpriteSize(value);
}, {immediate: true})

function initSpriteSize(width: number | undefined) {
  console.log('width', width)
  if (width) {
    console.log('width', width)
    configState.SPRITE_WIDTH = Math.floor(width / 8) //50props.width
    configState.SPRITE_HEIGHT = Math.floor(690 / 8) //50props.width
    configState.SCALE_X = (width / 690) / 1.5;
    configState.SCALE_Y = (width / 690) / 1.5;
    if (state.gameState) {
      hydrateGrid()
    }
  }
}

const initAnimationSpriteTextures = () => {
  for (let x = 0; x < 10; x++) {
    state.animationTextures.push(`frame_0${x}_delay-0.04s.png`)
  }

  for (let x = 10; x < 17; x++) {
    state.animationTextures.push(`frame_${x}_delay-0.04s.png`)
  }
}

const mapGridPositionToLocalCanvas = (value: number, constant: number): number => {
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
          x: mapGridPositionToLocalCanvas(grid[x][y].position.row, configState.SPRITE_WIDTH),
          y: mapGridPositionToLocalCanvas(grid[x][y].position.col, configState.SPRITE_HEIGHT)
        },
        hitArea: new Rectangle(
          mapGridPositionToLocalCanvas(grid[x][y].position.row, configState.SPRITE_WIDTH),
          mapGridPositionToLocalCanvas(grid[x][y].position.col, configState.SPRITE_HEIGHT),
          configState.SPRITE_WIDTH,
          configState.SPRITE_HEIGHT
        ),
        positionGrid: grid[x][y].position,
        texture: `/assets/images/hearts/${grid[x][y].type}.png`,
        scale: { x: configState.SCALE_X, y: configState.SCALE_Y }
      }
      state.sprites.push(spriteData)
    }
  }
}

function saveElementToState(element: SpriteComponent, current = false) {
  if (current) {
    state.selected = element
    state.selectedBuffer = {
      position: {
        x: element.position.x,
        y: element.position.y
      }
    }
  } else {
    state.nextSelected = element
    state.nextSelectedBuffer = {
      position: {
        x: element.position.x,
        y: element.position.y
      }
    }
  }
}

const resetStateValueScale = () => {
  state.selected.scale = { x: configState.SCALE_X, y: configState.SCALE_Y }
}

const handleClick = (event: any) => {
  console.log("HANDLE CLICK", event)
  let from
  let to
  const element = event.currentTarget
  if (state.isMoving) {
    return
  }
  if (!state.selected) {
    saveElementToState(element, true)
  } else {
    if (element !== state.selected) {
      saveElementToState(element)
      from = toRaw(state.selected.positionGrid)
      to = toRaw(element.positionGrid)
      socketStore.moveRequest(from, to)
    } else {
      resetStateValueScale()
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
  state.isMoving = true
  const randomIndex = Math.floor(Math.random() * 6)
  const moveSound = new Audio(configState.sounds[randomIndex])

  moveSound.volume = import.meta.env.VITE_EFFECT_SOUND_VOLUME

  state.gameState = response.data as GameState
  state.matches = response.data.matches
  state.newCells = response.data.new_cells
  state.isMoveSuccessfull = true

  gameInfo.setScore(state.gameState.score)
  moveSound.play()
  chatStore.checkScore()
}

const initializeWebSocketHandler = () => {
  socketStore.socket?.addEventListener('message', (event: MessageEvent<any>) => {
    try {
      const response = JSON.parse(event.data)
      console.log('response from ws', response)

      if (response.path == '/game/start_game') {
        onGameStart(response)
      }

      if (response.path == '/game/move') {
        onGameMove(response)
      }

      if (
        response.code == 500 &&
        (response.error.includes('move unsuccessful') || response.error.includes('invalid move'))
      ) {
        resetStateValueScale()
        saveElementToState(state.nextSelected, true)
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })
}

const shrinkDeletedCells = () => {
  state.matches.forEach((match) => {
    match.cells.forEach((matchCell) => {
      state.sprites.forEach((sprite) => {
        if (sprite.id == matchCell.id && sprite.scale.x > 0) {
          sprite.scale.x = 0
          sprite.scale.y = 0
        }
      })
    })
  })

  state.explosionsArray = [...state.newCells]
  setTimeout(() => {
    state.isMoving = false
    state.deleted = true
    state.matches = []
  }, 500)
}

function animationStateMachine(deltaTime: number) {
  const dx = state.nextSelectedBuffer.position.x - state.selected.position.x
  const dy = state.nextSelectedBuffer.position.y - state.selected.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance > state.animationSpeed) {
    const normalizedX = dx / distance
    const normalizedY = dy / distance
    state.selected.position.x += normalizedX * state.animationSpeed * deltaTime
    state.selected.position.y += normalizedY * state.animationSpeed * deltaTime

    state.nextSelected.position.x += -normalizedX * state.animationSpeed * deltaTime
    state.nextSelected.position.y += -normalizedY * state.animationSpeed * deltaTime
  } else {
    state.selected.position.x = state.nextSelectedBuffer.position.x
    state.selected.position.y = state.nextSelectedBuffer.position.y

    state.nextSelected.position.x = state.selectedBuffer.position.x
    state.nextSelected.position.y = state.selectedBuffer.position.y

    state.selected = null
    state.nextSelected = null
    if (state.matches) shrinkDeletedCells()
  }
}

onMounted(() => {
  socketStore.startGameRequest()
})

onBeforeMount(() => {
  initAnimationSpriteTextures()
  initializeWebSocketHandler()
})

onTick((deltaTime) => {
  if (state.deleted == true) {
    hydrateGrid()
    state.deleted = false
  }

  if (state.isMoving == true && state.selected && state.nextSelected) {
    animationStateMachine(deltaTime)
  }

  if (state.selected) {
    const scale = configState.SCALE_X + 0.1 * Math.sin(Date.now() / 100)
    state.selected.scale.x = scale
    state.selected.scale.y = scale
  }
})
</script>
<template>
  <Loader :resources="['/assets/animation_data/explosion_data_file.json']">
    <Container>
      <animated-sprite
        v-for="explostion in state.explosionsArray"
        :key="explostion.id"
        :textures="state.animationTextures"
        :playing="true"
        :loop="false"
        :animation-speed="0.45"
        :anchor="0.5"
        :x="mapGridPositionToLocalCanvas(explostion.position.row, configState.SPRITE_WIDTH) + 10"
        :y="mapGridPositionToLocalCanvas(explostion.position.col, configState.SPRITE_HEIGHT)"
        :scale="0.6"
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
