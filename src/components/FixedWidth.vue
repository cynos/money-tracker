<template>
  <div class="w-full relative flex flex-col mx-auto my-0 h-dvh bg-white shadow-lg" :style="{ maxWidth: width }">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: '480px'
  },
})
</script>
