<script setup lang="ts">
import { onMounted, onUpdated, ref, useTemplateRef } from 'vue'
import { Application } from 'vue3-pixi'

const container = useTemplateRef('game-container');
const containerWidth = ref(0);

const handleContainerSize = (el: any) => {
  if (el.value) {
    const positionInfo = el?.value.getBoundingClientRect();
    containerWidth.value = positionInfo.width;
  }
}

onMounted(() => {
  handleContainerSize(container)
  addEventListener('resize',(event) => handleContainerSize(container))
})

onUpdated(() => {
  handleContainerSize(container)
})
</script>

<template>
  <div class="main-container container" ref="game-container">
    <Application :background-alpha="0" :width="containerWidth" :height="690" auto-resize="true" :resize-to="container">
      <container>
        <slot name="grid" :width="containerWidth"></slot>
      </container>
    </Application>
  </div>
</template>

<style scoped>
.container {
  width: 70%;
  min-height: 560px;
}
</style>
