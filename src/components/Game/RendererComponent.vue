<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Application } from 'vue3-pixi'

const container = useTemplateRef('container')
</script>

<template>
  <div class="main-container container" :ref="container">
    <Application :width="400" :height="430" :background-alpha="0" :resize-to="container">
      <container>
        <slot></slot>
      </container>
    </Application>
  </div>
</template>

<style scoped>
.container {
  width: 96%;
}
</style>
