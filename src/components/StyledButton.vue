<script setup lang="ts"></script>

<template>
  <button class="button-main">
    <span class="gameria-text button-title"><slot></slot></span>
  </button>
</template>

<style scoped>
.button-main {
  transition: background-color 1s;
  border-radius: 60px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0px -59px 67.4px 0px rgba(255, 255, 255, 0.5) inset;
  padding: 15px 115px 15px 115px;
  margin-bottom: 20px;
}
.button-main:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 1);
}
.button-main:disabled {
  color: grey;
}

.button-main:disabled:hover {
  cursor: default;
  background: rgba(255, 255, 255, 0.2);
}
.button-title {
  font-size: 40px;
}
</style>
