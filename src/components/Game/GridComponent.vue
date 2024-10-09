<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { onTick } from 'vue3-pixi'

const hearts = ['red', 'pink', 'purple', 'blue', 'green', 'yellow'].map((heart) => ({
  name: heart,
  url: `/src/assets/images/hearts/${heart}.png`
}))
const state = reactive({
  sprites: [],
  selected: null
})

const TILES_X = 7
const TILES_Y = 9
const SPRITE_WIDTH = 60
const SPRITE_HEIGHT = 64
const SCALE_X = 0.5
const SCALE_Y = 0.5

const hydrateGrid = () => {
  for (let x = 0; x < TILES_X; x++) {
    for (let y = 0; y < TILES_Y; y++) {
      const randomHeart = hearts[Math.trunc(Math.random() * hearts.length)]
      let spriteData = {
        id: Math.random() * 10000,
        anchor: { x: 0.5, y: 0.5 },
        position: {
          x: x * SPRITE_WIDTH + SPRITE_WIDTH / 2,
          y: y * SPRITE_HEIGHT + SPRITE_HEIGHT / 2
        },
        texture: randomHeart.url,
        scale: { x: SCALE_X, y: SCALE_Y }
      }
      state.sprites.push(spriteData)
    }
  }
}

const handleClick = (event) => {
  const element = event.currentTarget
  let elementPosition
  if (!state.selected) {
    elementPosition = element.position
    state.selected = element
  } else {
    if (element !== state.selected) {
      const bufferPosition = { x: state.selected.position.x, y: state.selected.position.y }
      state.selected.position = element.position
      element.position = bufferPosition
    }
    state.selected.scale = { x: SCALE_X, y: SCALE_Y }
    state.selected = null
  }
}

onMounted(() => {
  hydrateGrid()
})

onTick(() => {
  if (state.selected) {
    const scale = 0.5 + 0.1 * Math.sin(Date.now() / 100)
    state.selected.scale.x = scale
    state.selected.scale.y = scale
  }
})
</script>
<template>
  <container v-for="sprite in state.sprites" :key="sprite.id">
    <sprite
      @mousedown="handleClick"
      @touchstart="handleClick"
      event-mode="dynamic"
      :button-mode="true"
      :scale-x="sprite.scale.x"
      :scale-y="sprite.scale.y"
      :key="sprite.id"
      :position-x="sprite.position.x"
      :position-y="sprite.position.y"
      :anchor-x="sprite.anchor.x"
      :anchor-y="sprite.anchor.y"
      :texture="sprite.texture"
    />
  </container>
</template>
<style scoped></style>
