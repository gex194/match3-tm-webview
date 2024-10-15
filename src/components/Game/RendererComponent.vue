<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'
import { Application } from 'vue3-pixi'

const container = useTemplateRef<string>('container')
const innerWidth = window.innerWidth - 20
const innerHeight = window.innerHeight - 20

onMounted(() => {
  console.log('CONTAINER', container.value)
})
</script>

<template>
  <div class="main-container container" ref="container">
    <Application :background-alpha="0" :width="innerWidth" :height="430" :resize-to="container">
      <container>
        <slot></slot>
      </container>
    </Application>
  </div>
</template>

<style scoped>
.container {
  width: 96%;
  min-height: 460;
}
</style>
