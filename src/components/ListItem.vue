<template>
  <div class="flex flex-row items-center">
    <div class="flex flex-row items-center flex-1 max-w-full overflow-hidden" @dblclick="emit('double-click', props.id)"
      @click="e => parentClicked(e, props.id)">
      <slot name="icon" />
      <div class="flex flex-col flex-1 min-w-20">
        <p class="text-sm font-medium text-gray-900 truncate">
          {{ props.name }}
        </p>
        <p class="text-xs text-blue-600 font-medium truncate">
          {{ props.subName }}
        </p>
      </div>
      <slot name="space" />
    </div>
    <slot name="action" :id="props.id" />
  </div>
  <div v-if="(props.listOpened || props.listAutoOpen) && props.items?.length" class="flex flex-row">
    <div class="flex flex-col flex-1">
      <div v-for="(item) in props.items"
        :class="['min-w-0 flex flex-row justify-between items-center space-x-2 border-s-4 border-gray-200', internalSelected == item.id ? 'border-s-4 border-orange-500 bg-orange-50' : '']"
        :key="item.id" @dblclick="emit('double-click', `${props.id}#${item.id}`)"
        @click="e => childClicked(e, props.id, item.id)">
        <div class="flex flex-col flex-1 p-2">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ item.name }}
          </p>
          <p v-if="item.subName" class="text-xs text-blue-600 font-medium truncate">
            {{ item.subName }}
          </p>
          <slot name="spacesub" :data="item" />
        </div>
        <slot name="actionSub" :id="`${props.id}#${item.id}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import type { ItemGroup } from '@/types';
import { ref, watchEffect } from 'vue';

interface Config {
  listOpened?: boolean
  listAutoOpen?: boolean
}

const props = defineProps<ItemGroup<T> & Config>()

const internalSelected = ref('')

const parentClicked = (e: MouseEvent, id: string) => {
  internalSelected.value = id
  emit('update:parent:selected', 'parent', id)
}

const childClicked = (e: MouseEvent, id: string, subId: string) => {
  internalSelected.value = subId
  emit('update:child:selected', 'child', `${id}#${subId}`)
}

const emit = defineEmits<{
  (e: 'update:parent:selected', target: string, id: string): void
  (e: 'update:child:selected', target: string, id: string): void
  (e: 'double-click', id: string): void
}>()

watchEffect(() => {
  if (props.listOpened) internalSelected.value = ''
})
</script>
