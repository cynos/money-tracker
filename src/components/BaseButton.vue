<template>
  <button :class="[
    'font-medium border transition focus:outline-none focus:ring-2 focus:ring-offset-2',
    buttonClasses,
    sizeClasses,
    roundedClasses
  ]" @click="$emit('click', $event)">
    <slot v-if="$slots.default" />
    <div v-else>
      <component v-if="props.is" :is="isTag" />
      <span v-else>{{ props.text }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'fill' | 'outline'
type Color = 'red' | 'blue' | 'gray' | 'orange'
type Size = 'sm' | 'md' | 'lg'
type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'full'

const props = defineProps<{
  variant?: Variant
  color?: Color
  colorLevel?: 500 | 600
  size?: Size
  rounded?: Rounded
  text?: string
  is?: string | object
}>()

defineEmits<{
  (e: 'click', val: MouseEvent): void
}>()

// safer rename (tidak bentrok dengan props.is)
const isTag = props.is ?? 'div'

const variant = computed(() => props.variant ?? 'fill')
const color = computed(() => props.color ?? 'gray')
const size = computed(() => props.size ?? 'md')
const rounded = computed(() => props.rounded ?? 'md')
const level = computed(() => props.colorLevel ?? 500)

// 📌 mapping static agar Tailwind bisa build
const colorMap: Record<
  Color,
  Record<Variant, Record<number, string>>
> = {
  red: {
    fill: {
      500: 'bg-red-500 text-white border-red-500 hover:bg-red-600',
      600: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
    },
    outline: {
      500: 'bg-white text-red-500 border-red-500 hover:bg-red-50',
      600: 'bg-white text-red-600 border-red-600 hover:bg-red-50',
    },
  },
  blue: {
    fill: {
      500: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600',
      600: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
    },
    outline: {
      500: 'bg-white text-blue-500 border-blue-500 hover:bg-blue-50',
      600: 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50',
    },
  },
  gray: {
    fill: {
      500: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600',
      600: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700',
    },
    outline: {
      500: 'bg-white text-gray-500 border-gray-500 hover:bg-gray-50',
      600: 'bg-white text-gray-600 border-gray-600 hover:bg-gray-50',
    },
  },
  orange: {
    fill: {
      500: 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600',
      600: 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700',
    },
    outline: {
      500: 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50',
      600: 'bg-white text-orange-600 border-orange-600 hover:bg-orange-50',
    },
  },
}

const sizeMap: Record<Size, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const roundedMap: Record<Rounded, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

const buttonClasses = computed(
  () => colorMap[color.value][variant.value][level.value]
)
const sizeClasses = computed(() => sizeMap[size.value])
const roundedClasses = computed(() => roundedMap[rounded.value])
</script>
