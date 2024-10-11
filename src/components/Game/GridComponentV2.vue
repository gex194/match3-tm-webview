<script setup lang="ts">
import { reactive, onMounted, getCurrentInstance, ref, onBeforeUpdate } from 'vue'
import { onTick } from 'vue3-pixi'

// Тип для элемента в сетке
type Cell = {
  id: number
  name: string
  texture: string
  position: { x: number; y: number }
  scale: { x: number; y: number }
}

// Функция поиска совпадений
function matchHorizontalGroups(grid: Cell[][]) {
  let groups = []
  let lastItem = undefined
  let chainLength = 1
  let currentGroup: Cell[] = []

  const maxX = grid.length
  const maxY = grid[0].length

  // Проверка строк
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const item = grid[x][y]
      if (item.name == lastItem?.name) {
        chainLength++
        currentGroup.push(item)
        console.log('HORIZONTAL MATCH')
      } else {
        if (chainLength >= 3) {
          groups.push(...currentGroup)
        }
        lastItem = item
        chainLength = 1
        currentGroup = [{ ...item }]
      }
    }
    if (currentGroup.length >= 3) {
      groups.push(...currentGroup)
    }
    lastItem = undefined
    chainLength = 1
  }
  return groups
}

const matchVerticalGroups = (grid: Cell[][]) => {
  const groups = []
  let lastItem = undefined
  let chainLength = 1
  let currentGroup = [] as Cell[]

  const maxX = grid.length
  const maxY = grid[0].length

  for (let x = 0; x < maxX; x++) {
    const row = grid[x]
    for (let y = 0; y < maxY; y++) {
      const item = row[y]
      if (item.name == lastItem?.name) {
        chainLength++
        currentGroup.push(item)
        console.log('VERTICAL MATCH')
      } else {
        if (chainLength >= 3) {
          groups.push(...currentGroup)
        }
        lastItem = item
        chainLength = 1
        currentGroup = [{ ...item }]
      }
    }
    // end of row
    if (chainLength >= 3) {
      groups.push(...currentGroup)
    }
    chainLength = 1
    lastItem = undefined
    currentGroup = []
  }
  console.log(groups)
  return groups
}

const findMatches = (grid: Cell[][]) => {
  matchedCells.value = [...matchVerticalGroups(grid), ...matchHorizontalGroups(grid)]
}
const hearts = ['red', 'pink', 'purple', 'blue', 'green', 'yellow'].map((heart) => ({
  name: heart,
  url: `/src/assets/images/hearts/${heart}.png`
}))

let grid = ref([] as Cell[][])
const matchedCells = ref([] as Cell[])
const selected = ref(null as Cell | null)

const instance = getCurrentInstance()

const TILES_X = 7
const TILES_Y = 9
const SPRITE_WIDTH = 60
const SPRITE_HEIGHT = 64
const SCALE_X = 0.5
const SCALE_Y = 0.5

const hydrateGrid = () => {
  grid.value = []
  for (let x = 0; x < TILES_X; x++) {
    const row = []
    for (let y = 0; y < TILES_Y; y++) {
      const randomHeart = hearts[Math.trunc(Math.random() * hearts.length)]
      let spriteData: Cell = {
        id: Math.trunc(Math.random() * 10000),
        name: randomHeart.name,
        texture: randomHeart.url,
        position: {
          x: x * SPRITE_WIDTH + SPRITE_WIDTH / 2,
          y: y * SPRITE_HEIGHT + SPRITE_HEIGHT / 2
        },
        scale: { x: SCALE_X, y: SCALE_Y }
      }
      row.push(spriteData)
    }
    grid.value.push(row)
  }
}

const handleClick = (event: any) => {
  const element = event.currentTarget
  if (!selected.value) {
    selected.value = element
    console.log(element)
  } else {
    if (element !== selected.value) {
      const bufferPosition = { x: selected.value.position.x, y: selected.value.position.y }
      selected.value.position = element.position
      element.position = bufferPosition
      changeGridElements(element, selected)
    }
    selected.value.scale = { x: SCALE_X, y: SCALE_Y }
    selected.value = null
  }
}

const changeGridElements = (element, selected) => {
  let bufferSelection = {
    id: selected.value.id,
    name: selected.value.name,
    texture: `/src/assets/images/hearts/${selected.value.name}.png`,
    position: { x: selected.value.position.x, y: selected.value.position.y },
    scale: { x: selected.value.scale.x, y: selected.value.scale.y }
  }
  grid.value.forEach((col, colIndex) => {
    col.forEach((row, rowIndex) => {
      if (row.id == selected.value.id) {
        let cellData: Cell = {
          id: element.id,
          name: element.name,
          texture: `/src/assets/images/hearts/${element.name}.png`,
          position: { x: element.position.x, y: element.position.y },
          scale: { x: element.scale.x, y: element.scale.y }
        }
        console.log('cellDataElement', cellData)
        grid.value[colIndex][rowIndex] = cellData
      }

      if (row.id == element.id) {
        let cellData: Cell = {
          id: bufferSelection.id,
          name: bufferSelection.name,
          texture: `/src/assets/images/hearts/${bufferSelection.name}.png`,
          position: { x: bufferSelection.position.x, y: bufferSelection.position.y },
          scale: { x: SCALE_X, y: SCALE_Y }
        }
        grid.value[colIndex][rowIndex] = cellData
      }
    })
  })
  console.log('GRID', grid.value)
  findMatches(grid.value)
}

const replaceMatches = () => {
  grid.value.forEach((col, colIndex) => {
    col.forEach((row, rowIndex) => {
      if (matchedCells.value.some((x) => x.id == row.id)) {
        if (grid.value[colIndex][rowIndex].scale.x > 0) {
          grid.value[colIndex][rowIndex].scale.x -= 0.01
        }
      }
    })
  })

  //   grid.value.forEach((col, colIndex) => {
  //     matchedCells.value.forEach((cell, cellIndex) => {
  //       if (col.find((x) => x.id == cell.id)) {
  //         if (grid.value[colIndex][cellIndex].scale.x > 0) {
  //           grid.value[colIndex][cellIndex].scale.x -= 0.01 * Math.sin(Date.now() / 100)
  //         }
  //       }
  //     })
  //   })
}

onMounted(() => {
  hydrateGrid()
})

onTick(() => {
  if (matchedCells.value.length > 0) {
    replaceMatches()
  }
  if (selected.value) {
    const scale = 0.5 + 0.1 * Math.sin(Date.now() / 100)
    selected.value.scale.x = scale
    selected.value.scale.y = scale
  }
})
</script>

<template>
  <container v-for="(col, colIndex) in grid" :key="colIndex">
    <sprite
      v-for="sprite in col"
      :key="sprite.id"
      @mousedown="handleClick"
      @touchstart="handleClick"
      event-mode="dynamic"
      :button-mode="true"
      :scale-x="sprite.scale.x"
      :scale-y="sprite.scale.y"
      :position-x="sprite.position.x"
      :position-y="sprite.position.y"
      :anchor-x="0.5"
      :anchor-y="0.5"
      :texture="sprite.texture"
      :id="sprite.id"
      :name="sprite.name"
    />
  </container>
</template>

<style scoped></style>
