<template>
  <div class="w-full">
    <div v-if="$slots.customInput"
      :class="['absolute inset-0 z-10 bg-white h-full p-2 rounded-sm', showCustomInput ? 'block' : 'hidden']">
      <div class="flex flex-row-items-center space-x-3">
        <component :is="ArrowLeftCircle" class="text-gray-500 size-6 mb-4" @click="showCustomInputToggle()" />
        <slot name="customInputTitle" />
      </div>
      <slot name="customInput" />
    </div>
    <!-- Wrapper -->
    <div class="relative border border-gray-100 rounded-md px-4 py-2 cursor-pointer hover:border-gray-500 transition"
      :class="isActive ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200'" @click="handleClick">
      <!-- Label -->
      <label v-if="!hideLabel"
        :class="['absolute -top-2 left-3 px-1 text-xs text-gray-700 font-medium', labelClass ?? 'bg-white']">
        {{ labelAlias ?? label }}
      </label>
      <!-- Input -->
      <textarea v-if="props.formType === 'textarea'" :readonly="!input" :name="props.name" :class="['text-base text-gray-700 focus:outline-none w-full', inputTextDecoration ?? '',
        isActive ? 'text-black font-semibold' : 'text-gray-500']" ref="inputRef" v-model="value"
        :placeholder="props.placeholder" @focus="onFocusBlur" @blur="onFocusBlur" @input="onInput" />
      <input v-if="props.formType === 'input'" :readonly="!input" :name="props.name" :class="['text-base text-gray-700 focus:outline-none w-full', inputTextDecoration ?? '',
        isActive ? 'text-black font-semibold' : 'text-gray-500']" ref="inputRef" type="text" v-model="value"
        :placeholder="props.placeholder" @focus="onFocusBlur" @blur="onFocusBlur" @input="onInput" />
    </div>
    <!-- Helper text -->
    <div v-if="helper" class="mt-1 text-xs text-gray-500">
      {{ helper }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core';
import { ArrowLeftCircle } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';

interface Props {
  name?: string
  label: string
  labelAlias?: string
  labelClass?: string
  hideLabel?: boolean
  placeholder?: string
  modelValue: string
  selected?: string
  helper?: string
  refElement?: HTMLInputElement | null
  input?: boolean
  formType?: 'input' | 'textarea'
  inputTextDecoration?: 'line-through' | 'underline' | 'overline'
  number?: 'plain' | 'currency'
}

const props = withDefaults(defineProps<Props>(), {
  formType: 'input',
})

const inputRef = ref(props.refElement)
const value = ref(props.modelValue)
const selected = ref(props.selected)
const [showCustomInput, showCustomInputToggle] = useToggle()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'update:selected', val: string): void
  (e: 'update:refElement', val: HTMLInputElement | null): void
  (e: 'click', val: string): void
}>()

const isActive = computed(() => selected.value === props.label)

// Sync between internal ref with props which is also ref
watch(() => props.modelValue, val => {
  value.value = val
})

watch(() => props.refElement, val => {
  inputRef.value = val
})

watch(inputRef, (val) => {
  emit('update:refElement', val!)
})

watch(value, (val) => {
  emit('update:modelValue', val)
})

function formatCurrency(value: string): string {
  const number = parseInt(value.replace(/\D/g, '')) || 0
  return number.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function onInput(e: Event) {
  if (props.number) {
    const val = (e.target as HTMLInputElement).value
    value.value = val.replace(/\D/g, '') // Simpan hanya angka
  } else {
    const val = (e.target as HTMLInputElement).value
    value.value = val
  }
}

function onFocusBlur(e: FocusEvent) {
  switch (e.type) {
    case "focus":
      emit('update:selected', props.label)
      selected.value = props.label
      return
    case "blur":
      if (props.number == 'currency')
        value.value = formatCurrency(value.value);
      selected.value = ''
      return
  }
}

function handleClick() {
  emit('update:selected', props.label)
  emit('click', props.label)
  showCustomInputToggle()
}

onMounted(() => {
  emit('update:refElement', inputRef.value as HTMLInputElement)
  if (props.selected === props.label) {
    inputRef.value?.focus()
  }
})
</script>
