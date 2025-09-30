  <template>
    <div class="relative w-full">
      <!-- Button -->
      <button @click="toggle"
        class="w-full flex justify-between items-center border border-gray-200 rounded px-3 py-2 bg-white text-left">
        <span class="truncate">
          {{ displayLabel }}
        </span>
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown -->
      <div v-if="open"
        class="absolute w-full border border-gray-200 rounded bg-white shadow-lg z-100 max-h-60 overflow-auto"
        :class="directionClass">
        <!-- Search box (mode searchable) -->
        <div v-if="mode === 'searchable'" class="p-2">
          <input v-model="search" type="text" placeholder="Search..."
            class="w-full border border-gray-200 rounded px-2 py-1 text-sm" />
        </div>

        <ul>
          <li v-for="(option, idx) in filteredOptions" :key="idx"
            class="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2" @click="selectOption(option)">
            <!-- Multiple mode pakai checkbox -->
            <template v-if="mode === 'multiple'">
              <input type="checkbox" class="form-checkbox" :checked="isSelected(option)"
                @change.stop="toggleOption(option)" />
              <span>{{ option.label }}</span>
            </template>

            <!-- Standard / Searchable mode -->
            <template v-else>
              <span>{{ option.label }}</span>
            </template>
          </li>
        </ul>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"

export type Option = {
  label: string
  value: string | number
}

const props = defineProps<{
  options: Option[]
  modelValue: string | number | (string | number)[] | null
  mode?: "standard" | "searchable" | "multiple"
  placeholder?: string
  direction?: "up" | "down"   // 👈 baru
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | (string | number)[] | null): void
}>()

const open = ref(false)
const search = ref("")
const mode = computed(() => props.mode ?? "standard")

const directionClass = computed(() =>
  props.direction === "up" ? "bottom-full mb-1" : "top-full mt-1"
)

function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}

const filteredOptions = computed(() => {
  if (mode.value === "searchable" && search.value) {
    return props.options.filter((o) =>
      o.label.toLowerCase().includes(search.value.toLowerCase())
    )
  }
  return props.options
})

function selectOption(option: Option) {
  if (mode.value === "multiple") return
  emit("update:modelValue", option.value)
  close()
}

function toggleOption(option: Option) {
  if (mode.value !== "multiple") return
  const current = Array.isArray(props.modelValue) ? props.modelValue : []
  if (current.includes(option.value)) {
    emit("update:modelValue", current.filter((v) => v !== option.value))
  } else {
    emit("update:modelValue", [...current, option.value])
  }
}

function isSelected(option: Option) {
  if (mode.value === "multiple") {
    return Array.isArray(props.modelValue) && props.modelValue.includes(option.value)
  }
  return props.modelValue === option.value
}

const displayLabel = computed(() => {
  if (mode.value === "multiple") {
    const current = Array.isArray(props.modelValue) ? props.modelValue : []
    if (current.length === 0) return props.placeholder ?? "Select..."
    const labels = props.options.filter((o) => current.includes(o.value)).map((o) => o.label)
    return labels.join(", ")
  } else {
    const selected = props.options.find((o) => o.value === props.modelValue)
    return selected ? selected.label : props.placeholder ?? "Select..."
  }
})

// auto close dropdown jika klik di luar
function onClickOutside(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest(".relative")) {
    close()
  }
}
watch(open, (val) => {
  if (val) {
    document.addEventListener("click", onClickOutside)
  } else {
    document.removeEventListener("click", onClickOutside)
  }
})
</script>
