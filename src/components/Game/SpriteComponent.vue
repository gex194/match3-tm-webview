<template>
  <sprite
      @mousedown="handleClick"
      @touchstart="handleClick"
      event-mode="dynamic"
      :button-mode="true"
      :scale-x="sprite.scale.x"
      :scale-y="sprite.scale.y"
      :position-x="sprite.position.x"
      :position-y="sprite.position.y"
      :anchor-x="sprite.anchor.x"
      :anchor-y="sprite.anchor.y"
      :texture="sprite.texture"
      :name="sprite.name"
      :positionGrid="sprite.positionGrid"
      :z-index="0"
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { SpriteData } from '@/types/gameTypes';

const props = defineProps<{
  sprite: SpriteData;
  handleClick: (event: any) => void;
}>();
</script>
