<template>
  <div class="flex items-center justify-between px-4 py-2 relative">
    <div class="absolute left-0 top-0 h-full w-1/3 flex items-center justify-start px-4 cursor-pointer"
      @click="prevDay">
      <span class="text-2xl text-gray-600 hover:text-black">
        <component :is="ChevronLeftIcon" />
      </span>
    </div>

    <!-- Tanggal -->
    <div class="mx-auto text-center font-medium pointer-events-none">
      {{ formattedDate }}
    </div>

    <div class="absolute right-0 top-0 h-full w-1/3 flex items-center justify-end px-4 cursor-pointer" @click="nextDay">
      <span class="text-2xl text-gray-600 hover:text-black">
        <component :is="ChevronRightIcon" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  initialDate?: Date
}>()

const currentDate = ref(props.initialDate || new Date())

const formattedDate = computed(() => {
  const d = currentDate.value
  const day = d.getDate()
  const month = d.getMonth() + 1 // 0-based
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
})

const prevDay = () => {
  currentDate.value = new Date(currentDate.value)
  currentDate.value.setDate(currentDate.value.getDate() - 1)
}

const nextDay = () => {
  currentDate.value = new Date(currentDate.value)
  currentDate.value.setDate(currentDate.value.getDate() + 1)
}

const emit = defineEmits<{
  (e: 'update:date', date: Date): void
}>()

watch(currentDate, (newDate) => {
  emit('update:date', newDate)
})

</script>
