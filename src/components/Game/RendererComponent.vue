<script setup lang="ts">
import { Application } from 'vue3-pixi'
</script>

<template>
  <div>
    <Application :width="430" :height="600" :background-alpha="0">
      <container>
        <slot></slot>
      </container>
    </Application>
  </div>
</template>

<style scoped>
.render-container {
}
</style>
