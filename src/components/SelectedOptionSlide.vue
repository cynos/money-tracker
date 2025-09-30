<template>
  <div class="flex items-center justify-between px-4 py-2 relative">
    <!-- Prev button -->
    <div class="absolute left-0 top-0 h-full w-1/3 flex items-center justify-start px-4 cursor-pointer" @click="prev">
      <span class="text-2xl text-gray-600 hover:text-black">
        <component :is="ChevronLeftIcon" />
      </span>
    </div>

    <!-- Selected option (input) -->
    <div class="mx-auto text-center font-medium pointer-events-none">
      <input class="bg-transparent text-center font-medium pointer-events-none" type="text" :name="formName"
        :value="currentOption" readonly />
    </div>

    <!-- Next button -->
    <div class="absolute right-0 top-0 h-full w-1/3 flex items-center justify-end px-4 cursor-pointer" @click="next">
      <span class="text-2xl text-gray-600 hover:text-black">
        <component :is="ChevronRightIcon" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  data: (string | number)[]
  formName?: string
  initialIndex?: number
  modelValue?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:selected', value: string | number): void
  (e: 'update:modelValue', value: string | number): void
}>()

const currentIndex = ref(props.initialIndex ?? 0)

const currentOption = computed(() => {
  if (!props.data || props.data.length === 0) return ''
  return props.data[currentIndex.value]
})

const prev = () => {
  if (!props.data || props.data.length === 0) return
  currentIndex.value =
    (currentIndex.value - 1 + props.data.length) % props.data.length
}

const next = () => {
  if (!props.data || props.data.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.data.length
}

// emit setiap kali option berubah
watch(
  currentIndex,
  () => {
    if (props.data && props.data.length > 0) {
      emit('update:selected', props.data[currentIndex.value])
      emit('update:modelValue', props.data[currentIndex.value])
    }
  },
  { immediate: true }
)
</script>
