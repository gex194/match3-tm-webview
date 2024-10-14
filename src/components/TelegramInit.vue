<script setup lang="ts">
import { MainButton, useWebAppPopup } from 'vue-tg'
const { showAlert } = useWebAppPopup()
</script>

<template>
  <MainButton text="OpenAlert" @click="() => showAlert('Hello!')" />
</template>
