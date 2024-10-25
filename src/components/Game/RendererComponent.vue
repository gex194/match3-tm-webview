<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watchEffect } from 'vue'
import { Application } from 'vue3-pixi'

const container = useTemplateRef('game-container');
const innerWidth: number = window.innerWidth - 20
const containerWidth = ref(0);

const handleContainerSize = (el: any) => {
  console.log('container', el)
  if (el.value) {
    const positionInfo = el?.value.getBoundingClientRect();
    containerWidth.value = positionInfo.width;

  }
}

onMounted(() => {
  handleContainerSize(container)
  addEventListener('resize',(event) => handleContainerSize(container))
})
</script>

<template>
  <div class="main-container container" ref="game-container">
    <Application :background-alpha="0" :width="containerWidth" :height="560" auto-resize="true" :resize-to="container">
      <container>
        <slot name="grid" :width="containerWidth"></slot>
      </container>
    </Application>
  </div>
</template>

<style scoped>
.container {
  width: 96%;
  min-height: 560px;
}
</style>
