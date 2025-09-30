<template>
  <div :class="['absolute inset-0 z-50']" v-if="show">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40" @click="$emit('update:show', false)" />
    <!-- Sheet -->
    <div
      class="overflow-y-scroll absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-lg transition-transform duration-300"
      :class="{
        'translate-y-0': show,
        'translate-y-full': !show,
      }">
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits(['update:show'])
</script>
