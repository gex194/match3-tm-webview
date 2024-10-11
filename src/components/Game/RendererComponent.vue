<script setup lang="ts">
import { Application } from 'vue3-pixi'
</script>

<template>
  <div>
    <Application :width="475" :height="500" :background-alpha="0">
      <container>
        <slot></slot>
      </container>
    </Application>
  </div>
</template>

<style scoped></style>
