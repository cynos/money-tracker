<template>
  <div class="relative inline-block text-sm" ref="root">
    <!-- Toggle -->
    <button type="button" ref="toggleBtn" @click="toggle" @keydown="onToggleKeydown" :aria-expanded="isOpen"
      :aria-controls="menuId"
      class="inline-flex w-40 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300">
      <slot name="toggle">
        {{ selectedLabel }}
      </slot>
      <svg class="h-4 w-4 text-gray-500 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Menu -->
    <transition enter-active-class="transition ease-out duration-100" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <ul v-if="isOpen" ref="menu" :id="menuId" role="menu" @keydown.stop.prevent="onMenuKeydown"
        class="absolute z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none">
        <li v-for="(it, idx) in items" :key="it.value ?? idx" role="menuitem"
          :aria-disabled="it.disabled ? 'true' : 'false'" @click="onItemClick(it, idx)" @mouseenter="focusedIndex = idx"
          @mouseleave="focusedIndex = -1"
          class="cursor-pointer select-none px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100" :class="{
            'bg-gray-100': idx === focusedIndex,
            'opacity-50 cursor-not-allowed': it.disabled
          }">
          {{ it.label }}
        </li>
        <li v-if="items.length === 0" class="px-4 py-2 text-gray-400 italic select-none">
          — tidak ada pilihan —
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

interface DropdownItem {
  label: string;
  value: string | number | null;
  disabled?: boolean;
}

const props = defineProps({
  modelValue: { type: [String, Number, null] as unknown as () => string | number | null, default: null },
  items: { type: Array as () => DropdownItem[], required: true },
  placeholder: { type: String, default: 'Pilih...' },
  closeOnSelect: { type: Boolean, default: true }
});

const emit = defineEmits(['update:modelValue', 'open', 'close', 'select']);

const isOpen = ref(false);
const focusedIndex = ref(-1);
const menu = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);
const toggleBtn = ref<HTMLButtonElement | null>(null);
const menuId = `gd-menu-${Math.random().toString(36).slice(2, 9)}`;

const selectedLabel = computed(() => {
  const found = props.items.find((i) => i.value === props.modelValue);
  return found ? found.label : props.placeholder;
});

watch(isOpen, (v) => {
  if (v) {
    emit('open');
    setTimeout(() => {
      focusedIndex.value = props.items.findIndex(i => !i.disabled);
    }, 0);
  } else {
    emit('close');
    focusedIndex.value = -1;
  }
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
  toggleBtn.value?.focus();
}

function onItemClick(item: DropdownItem, idx: number) {
  if (item.disabled) return;
  emit('update:modelValue', item.value);
  emit('select', item);
  if (props.closeOnSelect) close();
  else focusedIndex.value = idx;
}

function onToggleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    isOpen.value = true;
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggle();
  }
}

function onMenuKeydown(e: KeyboardEvent) {
  const maxIdx = props.items.length - 1;
  if (e.key === 'ArrowDown') {
    let i = focusedIndex.value;
    do {
      i = i >= maxIdx ? 0 : i + 1;
    } while (props.items[i]?.disabled);
    focusedIndex.value = i;
  } else if (e.key === 'ArrowUp') {
    let i = focusedIndex.value;
    do {
      i = i <= 0 ? maxIdx : i - 1;
    } while (props.items[i]?.disabled);
    focusedIndex.value = i;
  } else if (e.key === 'Enter' || e.key === ' ') {
    const it = props.items[focusedIndex.value];
    if (it && !it.disabled) onItemClick(it, focusedIndex.value);
  } else if (e.key === 'Escape') {
    close();
  }
}

// click outside
function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
});
</script>
