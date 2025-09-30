<template>
  <div class="relative overflow-x-auto border-b border-gray-200 scrollbar-hide">
    <nav class="flex space-x-6 min-w-max whitespace-nowrap">
      <button v-for="tab in tabs" :data-id="tab" :key="tab"
        class="relative py-3 text-sm font-medium focus:outline-none flex-1" :class="{
          'text-black font-semibold': isActive(tab),
          'text-gray-400': !isActive(tab),
        }">
        {{ tab }}
        <span v-if="tab === active" class="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-full" />
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useActiveElement } from '@vueuse/core';
import { computed, onMounted, watch } from 'vue';

const activeElement = useActiveElement()
const active = computed(() => activeElement.value?.dataset?.id || (props.current ?? undefined))
const isActive = (label: string) => active.value === label

const props = defineProps<{
  tabs: string[]
  current?: string
}>()

const emit = defineEmits<{
  (e: 'active', value: string)
}>()

watch(active, v => v && emit('active', v))

onMounted(() => {

})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
