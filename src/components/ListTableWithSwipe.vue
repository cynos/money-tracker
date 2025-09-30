<template>
  <div class="divide-y divide-gray-100">
    <div v-for="(item, index) in items" :key="index" class="relative overflow-hidden"
      :ref="el => setupSwipe(el as HTMLElement, index)">
      <!-- Actions -->
      <div
        class="absolute inset-y-0 right-0 flex items-center bg-red-500 text-white px-4 transition-transform duration-300"
        :class="{ 'translate-x-0': activeIndex === index, 'translate-x-full': activeIndex !== index }">
        <button @click.stop="emit('delete', item)">Delete</button>
      </div>

      <!-- Item utama -->
      <div class="flex flex-row py-1 bg-white transition-transform duration-300"
        :class="{ '-translate-x-20': activeIndex === index }" @click.stop="emit('selected', item)">
        <slot name="row" :item="item">
          <div v-for="(col, colIndex) in columns" :key="colIndex" class="px-2" :class="[
            col.align === 'right' ? 'text-right' : 'text-left',
            col.class ?? '',
            col.width ? `w-${col.width}` : 'flex-1',
          ]">
            <slot :name="col.key" :item="item">
              <div class="text-sm text-gray-700 truncate">
                {{ item[col.key] }}
              </div>
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, watch } from "vue"
import { useSwipe, useEventListener } from "@vueuse/core"

export type Column = {
  key: string
  width?: string
  class?: string
  align?: "left" | "right"
}

const emit = defineEmits<{
  (e: "selected", item: Record<string, any>): void
  (e: "delete", item: Record<string, any>): void
}>()

defineProps<{
  columns: Column[]
  items: Record<string, any>[]
}>()

const activeIndex = ref<number | null>(null)

function setupSwipe(el: HTMLElement | null, index: number) {
  if (!el) return
  const { coordsStart, coordsEnd, isSwiping } = useSwipe(el, { threshold: 30 })

  watch(isSwiping, (swiping) => {
    if (!swiping) {
      const deltaX = coordsEnd.x - coordsStart.x

      if (deltaX < -50) {
        // swipe kiri: buka
        activeIndex.value = index
      } else if (deltaX > 50 && activeIndex.value === index) {
        // swipe kanan: tutup
        activeIndex.value = null
      }
    }
  })
}

// reset kalau klik/touch di luar item
useEventListener(document, "click", (e) => {
  const target = e.target as HTMLElement
  if (!target.closest(".relative.overflow-hidden")) {
    activeIndex.value = null
  }
})
</script>
