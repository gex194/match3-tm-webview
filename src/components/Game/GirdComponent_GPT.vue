<script setup lang="ts">
import { useGameInfoStore } from '@/stores/gameInfo'
import { useSocketStore } from '@/stores/socket'
import { reactive, onMounted, onBeforeMount, toRaw } from 'vue'
import { Loader, onTick } from 'vue3-pixi'

/* Определение интерфейсов и типов */

interface Position {
  x: number
  y: number
}

//
interface GridPosition {
  row: number
  col: number
}

interface SpriteData {
  id: string
  name: string
  anchor: Position
  isNew: boolean
  position: Position
  positionGrid: GridPosition
  texture: string
  scale: Position
  isAnimating: boolean
  startTime: number
  isAppearing: boolean
}

interface SelectionState {
  current: SpriteData | null
  buffer: Position | null
  next: SpriteData | null
  nextBuffer: Position | null
}

interface Flags {
  deleted: boolean
  isMoveSuccessful: boolean
}

interface GameState {
  board: {
    grid: any[][]
  }
  duration: number
  score: number
}

const CONFIG = {
  innerWidth: window.innerWidth - 20,
  innerHeight: window.innerHeight - 20,
  SPRITE_WIDTH: Math.floor((window.innerWidth - 20) / 8),
  SPRITE_HEIGHT: 54,
  SCALE_X: 0.45,
  SCALE_Y: 0.45,
  sounds: [
    '/assets/sounds/move1.mp3',
    '/assets/sounds/move2.mp3',
    '/assets/sounds/move3.mp3',
    '/assets/sounds/move4.mp3',
    '/assets/sounds/move5.mp3',
    '/assets/sounds/move6.mp3'
  ]
}

/* Состояние компонента */

const state = reactive({
  sprites: [] as SpriteData[],
  selection: {
    current: null,
    buffer: null,
    next: null,
    nextBuffer: null
  } as SelectionState,
  gameState: null as GameState | null,
  matches: [] as any[],
  newCells: [] as any[],
  flags: {
    deleted: false,
    isMoveSuccessful: false
  } as Flags,
  animationTextures: [] as string[]
})
const props = defineProps<{
  sprite: SpriteData
  handleClick: (sprite: SpriteData) => void
}>()

const { sprite, handleClick } = props

const onClick = (event: any) => {
  handleClick(sprite)
}
const socketStore = useSocketStore()
const gameInfo = useGameInfoStore()

// const handleClick = (event: any) => {
//   const sprite = event.currentTarget as SpriteData
//   if (!state.selection.current) {
//     selectSprite(sprite)
//   } else if (sprite !== state.selection.current) {
//     processSecondClick(sprite)
//   } else {
//     unselectSprite()
//   }
// }

/* Инициализация анимационных текстур */

const initAnimationSpriteTextures = () => {
  for (let x = 0; x < 17; x++) {
    state.animationTextures.push(`frame_0${x}_delay-0.04s.png`)
  }
}

/* Вспомогательные функции */

const mapGridPositionToLocalCanvas = (value: number, constant: number) => {
  return value * constant + constant / 2
}

/* Обновление сетки спрайтов */

const hydrateGrid = () => {
  if (!state.gameState) return
  const grid = state.gameState.board.grid
  state.sprites = grid.flatMap((row) =>
      row.map((cell) => {
        const spriteData: SpriteData = {
          id: cell.id,
          name: cell.type,
          anchor: { x: 0.5, y: 0.5 },
          isNew: cell.is_new,
          position: {
            x: mapGridPositionToLocalCanvas(cell.position.col, CONFIG.SPRITE_WIDTH),
            y: mapGridPositionToLocalCanvas(cell.position.row, CONFIG.SPRITE_HEIGHT)
          },
          positionGrid: cell.position,
          texture: `/assets/images/hearts/${cell.type}.png`,
          scale: { x: CONFIG.SCALE_X, y: CONFIG.SCALE_Y },
          isAnimating: false,
          startTime: 0,
          isAppearing: cell.is_new
        }
        // state.sprites.push(spriteData)
        return spriteData
      })
  )
}

/* Обработчики выбора спрайтов */

const selectSprite = (sprite: SpriteData) => {
  state.selection.current = sprite
  state.selection.buffer = { x: sprite.position.x, y: sprite.position.y }
}

const unselectSprite = () => {
  if (state.selection.current) {
    state.selection.current.scale = { x: CONFIG.SCALE_X, y: CONFIG.SCALE_Y }
    state.selection.current = null
    state.selection.buffer = null
  }
}

const processSecondClick = (sprite: SpriteData) => {
  state.selection.next = sprite
  state.selection.nextBuffer = { x: sprite.position.x, y: sprite.position.y }
  const from = toRaw(state.selection.current!.positionGrid)
  const to = toRaw(sprite.positionGrid)
  socketStore.moveRequest(from, to)
}

/* Обработчики событий игры */

const onGameStart = (response: any) => {
  state.gameState = response.data as GameState
  gameInfo.setTime(state.gameState.duration)
  hydrateGrid()
}

const onGameMove = (response: any) => {
  const randomIndex = Math.floor(Math.random() * CONFIG.sounds.length)
  const moveSound = new Audio(CONFIG.sounds[randomIndex])
  moveSound.volume = import.meta.env.VITE_GAME_EFFECT_SOUND_LEVEL
  state.gameState = response.data as GameState
  state.matches = response.data.matches
  state.newCells = response.data.new_cells
  state.flags.isMoveSuccessful = true
  gameInfo.setScore(state.gameState.score)
  moveSound.play()

  if (state.matches.length > 0) {
    initDeletionAnimation()
  } else {
    hydrateGrid()
    resetSelection()
  }
}

/* Инициализация анимации удаления */

const initDeletionAnimation = () => {
  const baseDelay = 50 // 0.1 секунды
  let delayCounter = 0

  state.matches.forEach((match) => {
    match.cells.forEach((matchCell: any) => {
      const sprite = state.sprites.find((sprite) => sprite.id === matchCell.id)
      if (sprite && !sprite.isAnimating) {
        sprite.isAnimating = true
        sprite.startTime = performance.now() + delayCounter
        delayCounter += baseDelay
      }
    })
  })

  state.flags.deleted = true
}

/* Сброс состояния выбора */

const resetSelection = () => {
  state.selection.current = null
  state.selection.buffer = null
  state.selection.next = null
  state.selection.nextBuffer = null
  state.flags.isMoveSuccessful = false
}

/* Обработчик сообщений сокета */

const handleSocketMessage = (event: MessageEvent<any>) => {
  try {
    const response = JSON.parse(event.data)
    console.log('Received message:', response)
    switch (response.path) {
      case '/game/start_game':
        onGameStart(response)
        break
      case '/game/move':
        onGameMove(response)
        break
      default:
        console.warn('Unknown response path:', response.path)
    }
  } catch (error) {
    console.error('Error parsing message:', error)
  }
}

const initializeWebSocketHandler = () => {
  socketStore.socket?.addEventListener('message', handleSocketMessage)
}

/* Анимация перемещения спрайтов */

function animationStateMachine(speed: number) {
  const selected = state.selection.current
  const nextSelected = state.selection.next
  const selectedBuffer = state.selection.buffer
  const nextSelectedBuffer = state.selection.nextBuffer

  if (!selected || !nextSelected || !selectedBuffer || !nextSelectedBuffer) return

  const moveSprite = (sprite: SpriteData, targetPos: Position) => {
    console.log('animation start')
    console.log('animation sprite data', sprite)
    console.log('animation targetPos', targetPos)
    if (sprite.position.x < targetPos.x) sprite.position.x += speed
    if (sprite.position.x > targetPos.x) sprite.position.x -= speed
    if (sprite.position.y < targetPos.y) sprite.position.y += speed
    if (sprite.position.y > targetPos.y) sprite.position.y -= speed
  }

  moveSprite(selected, nextSelectedBuffer)
  moveSprite(nextSelected, selectedBuffer)

  if (
      selected.position.x === nextSelectedBuffer.x &&
      selected.position.y === nextSelectedBuffer.y &&
      nextSelected.position.x === selectedBuffer.x &&
      nextSelected.position.y === selectedBuffer.y
  ) {
    resetSelection()
  }
}

/* Методы жизненного цикла */

onMounted(() => {
  socketStore.startGameRequest()
})

onBeforeMount(() => {
  initAnimationSpriteTextures()
  initializeWebSocketHandler()
})

/* Главный цикл анимации */

onTick(() => {
  const currentTime = performance.now()

  /* Анимация появления новых спрайтов */
  state.sprites.forEach((sprite) => {
    if (sprite.isAppearing) {
      const elapsed = currentTime - sprite.startTime
      const duration = 500 // Длительность анимации
      const progress = Math.min(elapsed / duration, 1)
      const scale = CONFIG.SCALE_X * progress
      sprite.scale.x = scale
      sprite.scale.y = scale

      if (progress >= 1) {
        sprite.isAppearing = false
      }
    }
  })

  /* Анимация удаления спрайтов */
  for (let i = state.sprites.length - 1; i >= 0; i--) {
    const sprite = state.sprites[i]
    if (sprite.isAnimating) {
      if (currentTime >= sprite.startTime) {
        sprite.scale.x -= 0.05
        sprite.scale.y -= 0.05

        if (sprite.scale.x <= 0 || sprite.scale.y <= 0) {
          state.sprites.splice(i, 1)
          sprite.isAnimating = false
        }
      }
    }
  }

  /* Проверка завершения анимаций удаления */
  if (state.flags.deleted) {
    const anyAnimating = state.sprites.some((sprite) => sprite.isAnimating)
    if (!anyAnimating) {
      hydrateGrid()
      state.flags.deleted = false
    }
  }

  /* Анимация перемещения спрайтов */
  if (state.flags.isMoveSuccessful) {
    animationStateMachine(1)
  }

  /* Анимация выбранного спрайта */
  if (state.selection.current) {
    const scale = CONFIG.SCALE_X + 0.1 * Math.sin(Date.now() / 100)
    state.selection.current.scale.x = scale
    state.selection.current.scale.y = scale
  }
})

const handleSpriteClick = (sprite: SpriteData) => {
  if (!state.selection.current) {
    selectSprite(sprite)
  } else if (sprite !== state.selection.current) {
    processSecondClick(sprite)
  } else {
    unselectSprite()
  }
}

</script>

<template>
  <Loader :resources="['/assets/animation_data/explosion_data_file.json']">
    <Container>
      <!-- Анимация новых ячеек -->
      <animated-sprite
          v-for="cell in state.newCells"
          :key="cell.id"
          :textures="state.animationTextures"
          :playing="!state.flags.isMoveSuccessful"
          :loop="false"
          :animation-speed="0.45"
          :anchor="0.5"
          :x="mapGridPositionToLocalCanvas(cell.position.col, CONFIG.SPRITE_WIDTH) + 10"
          :y="mapGridPositionToLocalCanvas(cell.position.row, CONFIG.SPRITE_HEIGHT)"
          :scale="0.3"
          :z-index="1"
      />

      <!-- Отображение спрайтов -->
      <sprite
          @mousedown="onClick"
          @touchstart="onClick"
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

<style scoped>
/* Добавьте стили при необходимости */
</style>
