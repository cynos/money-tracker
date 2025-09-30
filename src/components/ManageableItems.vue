<template>
  <Teleport to="#action-left-teleport">
    <button class="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @click="router.push({ name: 'dashboard' })">
      <component :is="ChevronLeft" />
    </button>
  </Teleport>
  <div class="px-4 pb-[4rem] flex flex-col flex-1 overflow-y-auto space-y-2">
    <div class="flex flex-row items-center gap-1">
      <input type="text" class="w-full p-2 rounded-sm focus:outline-none bg-gray-100" placeholder="Search"
        v-model="searchQuery">
      <div v-if="deleteAllPress" ref="deleteAllRef" class="bg-gray-100 p-2 rounded-sm" @click="removeChecked">
        <component :is="CircleXIcon" class="text-white fill-red-400" />
      </div>
      <div v-else ref="deleteAllRef" class="bg-gray-100 p-2 rounded-sm" @click="addItem">
        <component :is="CirclePlusIcon" class="stroke-gray-500" />
      </div>
      <div v-if="$slots.filterBottomSheet" class="bg-gray-100 p-2 rounded-sm" @click="filterClicked">
        <component :is="FunnelPlus" class="stroke-gray-500" />
      </div>
    </div>
    <div class="flex flex-1 items-center" v-if="!filteredItems.length">
      <EmptyState message="Items Not Found" :icon="InboxIcon" />
    </div>
    <div v-else class="max-w-full space-y-2 overflow-hidden mt-1">
      <ListItem v-for="item in filteredItems" :key="item.id" :id="item.id" :name="item.name" :subName="item.subName"
        @update:parent:selected="itemClicked" @update:child:selected="itemClicked"
        :list-opened="selected.includes(item.id)" :items="item.items" :list-auto-open="props.listAutoOpen">
        <template #icon>
          <div class="bg-slate-50 border-slate-200 border me-3 rounded-md p-2 shrink-0">
            <div class="w-5 h-5 flex justify-center items-center text-slate-400 font-bold">{{ item.icon }}</div>
          </div>
        </template>
        <template v-slot:space v-if="$slots.space">
          <slot name="space" :data="item" />
        </template>
        <template v-slot:spacesub="{ data }" v-if="$slots.spacesub">
          <slot name="spacesub" :data="data" />
        </template>
        <template v-slot:action="{ id }">
          <div class="flex flex-row text-xs text-slate-500 space-x-2">
            <button v-if="selected.includes(id)" @click="() => { itemClicked('parent', id); bottomSheetToggle() }"
              class="bg-slate-50 px-2 border-1 border-slate-200 rounded text-gray-500 focus:bg-slate-100">Edit</button>
            <component v-if="deleteAllPress"
              :class="['size-5 stroke-2', isChecked(id) ? 'text-white fill-red-400' : 'text-slate-400']"
              :is="SquareCheck" @click="addChecked(id)" />
            <div v-else>
              <component class="w-4" :is="ChevronDown" v-if="selected.indexOf(id) > -1" />
              <component class="w-4" :is="ChevronUp" v-else />
            </div>
          </div>
        </template>
      </ListItem>
    </div>
  </div>
  <BottomSheet v-model:show="showBottomSheet">
    <form ref="formRef" class="space-y-5 relative" @submit.prevent="() => deleteState ? handleDelete() : handelSave()">
      <div class="flex items-center space-x-2">
        <h2 class="text-lg font-semibold me-auto">{{ bottomSheetData ? 'Edit' : 'Add' }} Item</h2>
        <component v-if="selected.indexOf('#') == -1 && props.addSubItemAble" class="text-gray-500" :is="PlusIcon"
          @click="addSubItem" />
        <component :class="[deleteState ? 'text-red-500' : 'text-gray-500']" :is="Trash2Icon"
          @click="() => deleteToggle()" />
        <component class="text-gray-500" :is="CircleXIcon" @click="bottomSheetCloseHandler" />
      </div>
      <div class="space-y-4">
        <FormRowSelector input name="name" label="Name" selected="Name" :model-value="bottomSheetData?.name ?? ''"
          @update:model-value="v => inputItemName = v" />
        <slot name="form" :data="bottomSheetData" />
        <div class="space-y-4" v-if="subItems.length > 0">
          <div class="border-2 border-dotted border-gray-300"></div>
          <div class="flex items-center space-x-2">
            <h2 class="text-lg font-semibold">Sub Item</h2>
            <button class="text-gray-400 underline" type="button" @click="clearSubItem">clear</button>
          </div>
          <div class="py-2 space-y-4 max-h-50 overflow-y-scroll">
            <FormRowSelector v-for="(sub) in subItems" :key="sub.id" input :label="sub.id"
              v-bind="(sub as ItemGroup<{ new: boolean }>).meta?.new ? { labelAlias: 'New!', labelClass: 'bg-amber-300' } : false"
              :id="sub.id" :model-value="sub.name ?? ''" :selected="recentlyAdded"
              @update:model-value="v => sub.name = v" />
          </div>
        </div>
      </div>
      <h6 class="text-gray-500 text-sm">{{ deleteState && bottomSheetData?.items?.length ? `Because this is parent item,
        there is
        (${bottomSheetData?.items?.length}) subs items also will be deleted.` : '' }}</h6>
      <BaseButton class="w-full" variant="fill" color="red" rounded="sm" size="md"
        text="Warning: This action cannot be undone!" type="submit" v-if="deleteState" />
      <BaseButton class="w-full" variant="fill" color="orange" rounded="sm" size="md" text="Save" type="submit"
        v-else />
    </form>
  </BottomSheet>
  <BottomSheet v-model:show="filterBottomSheet">
    <div class="space-y-5 relative">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold me-auto">Filter</h2>
        <component class="text-gray-500" :is="CircleXIcon" @click="bottomSheetCloseHandler" />
      </div>
      <slot name="filterBottomSheet" />
    </div>
  </BottomSheet>
</template>

<script setup lang="ts" generic="T">
import ListItem from '@/components/ListItem.vue';
import BottomSheet from '@/components/BottomSheet.vue';
import { ChevronDown, ChevronLeft, ChevronUp, CirclePlusIcon, CircleXIcon, FunnelPlus, InboxIcon, PlusIcon, SquareCheck, Trash2Icon } from 'lucide-vue-next';

import { computed, onMounted, onUnmounted, ref, toRaw, toRef, watch } from 'vue';
import type { ItemGroup, ResponseStatus } from '@/types';
import BaseButton from '@/components/BaseButton.vue';
import { onLongPress, useToggle } from '@vueuse/core';
import FormRowSelector from '@/components/FormRowSelector.vue';
import { generateRandomString } from '@/utils/rand';
import { formDataToNestedObject, getInitial } from '@/utils/format';
import { deepToRaw } from '@/utils/converted';
import EmptyState from './EmptyState.vue';
import { router } from '@/router';

interface Props {
  data: ItemGroup<T>[]
  addSubItemAble?: boolean
  disableItemOnClicked?: 'parent' | 'child'
  listAutoOpen?: boolean
  overrideChildClicked?: () => void
  fetchAll: () => Promise<ItemGroup<T>[]>
  getById: (id: string) => Promise<ItemGroup<T> | null>
  add: (item: ItemGroup<T>) => Promise<ResponseStatus>
  update: (id: string, updated: Partial<ItemGroup<T>>) => Promise<ResponseStatus>
  updateItem?: ((parentId: string, itemId: string, updated: Partial<ItemGroup<T>>) => Promise<ResponseStatus>) | undefined
  remove: (id: string) => Promise<ResponseStatus>
  removeItem?: ((parentId: string, itemId: string) => Promise<ResponseStatus>) | undefined
}

const emit = defineEmits<{
  (e: 'selectedItem', id: string): void
}>()

const props = defineProps<Props>()
const formRef = ref<HTMLFormElement | null>(null)
const items = toRef(props, 'data')
const selected = ref<string>('')
const selectedTarget = ref<string>('')
const searchQuery = ref('')
const inputItemName = ref('')
const recentlyAdded = ref('')
const subItems = ref<ItemGroup<T>[]>([])
const deleteAllRef = ref<HTMLElement | null>(null)
const checkedList = ref<string[]>([])
const [deleteState, deleteToggle] = useToggle()
const [deleteAllPress, deleteAllPressToggle] = useToggle()
const [showBottomSheet, bottomSheetToggle] = useToggle()
const [filterBottomSheet, filterBottomSheetToggle] = useToggle()

const bottomSheetData = computed(() => {
  const sel = selected.value
  if (!sel) return null

  if (sel.includes('#')) {
    const [parentId, childId] = sel.split('#')
    const parent = items.value.find(p => p.id === parentId)
    if (!parent || !parent.items) return null
    const child = parent.items.find(c => c.id === childId)
    return child
  }

  const parent = items.value.find(p => p.id === sel)
  return parent
})

watch(showBottomSheet, (v) => {
  // on bottomsheet close
  if (!v) {
    inputItemName.value = ''
    deleteState.value = v
    subItems.value = []
  }
})

const filteredItems = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return items.value
    .map((p) => {
      if (p.name.toLowerCase().includes(search)) {
        return p
      }

      const sub = (p.items ?? []).filter((s) =>
        s.name.toLowerCase().includes(search)
      )

      if (sub.length > 0) {
        selected.value = p.id
        return {
          ...p,
          items: sub,
        }
      }

      return null
    })
    .filter(Boolean) as ItemGroup<T>[]
})

const handelSave = async () => {
  const data = (bottomSheetData.value ?? {}) as ItemGroup<T>
  const form = formDataToNestedObject(formRef.value!)
  // update sub items section
  if (selected.value.indexOf('#') > -1) {
    data.name = inputItemName.value || data.name
    data.meta = form.meta as T
    data.updatedAt = new Date()
    const ids = selected.value.split('#')
    const res = await props?.updateItem?.(ids[0], ids[1], data)
    if (!res!.success) {
      alert('failed updating data')
      return
    }
    bottomSheetToggle()
    return
  }

  // set sub item
  if (subItems.value.length) {
    subItems.value = subItems.value.map(v => toRaw(v))
    data.items = toRaw(subItems.value).map(v => ({ ...v, icon: v.icon ?? getInitial(v.name), createdAt: new Date() })).filter(v => v.name !== '') as ItemGroup<T>[]
  }

  // insert if id not exists
  if (!data.id) {
    const payload = {
      ...data,
      ...form,
      id: generateRandomString(5),
    }
    payload.createdAt = new Date()
    payload.icon ??= getInitial(payload.name)
    const res = await props.add(deepToRaw(payload))
    if (!res.success) {
      alert('failed save data')
      return
    }
  } else {
    // update parent items section
    const payload = {
      ...data,
      ...form,
    }
    payload.updatedAt = new Date()
    const res = await props.update(bottomSheetData.value?.id as string, deepToRaw(payload))
    if (!res.success) {
      alert('failed updating data')
      return
    }
  }

  bottomSheetToggle()
}

const handleDelete = async () => {
  if (selected.value.indexOf('#') > -1) {
    const ids = selected.value.split('#')
    const res = await props?.removeItem?.(ids[0], ids[1])
    if (!res!.success) {
      alert('failed deleting data')
    }
  } else {
    const res = await props.remove(bottomSheetData.value?.id as string)
    if (!res.success) {
      alert('failed deleting data')
    }
  }
  bottomSheetToggle()
}

function addItem() {
  selected.value = ''
  bottomSheetToggle()
}

function addSubItem() {
  const data = ref<ItemGroup<T>>({ id: generateRandomString(5), name: '', meta: { new: true } as T })
  // set auto focus once added one
  recentlyAdded.value = data.value.id
  // insert existing
  if (subItems.value.length < 1) {
    items.value.find(v => v.id === bottomSheetData.value?.id)?.items?.forEach(item => {
      subItems.value.push({ id: item.id, name: item.name })
    })
  }
  // insert new sub
  subItems.value.push(data.value)
}

function clearSubItem() {
  subItems.value = subItems.value.filter(v => !v.meta)
}

function itemClicked(target: string, id: string) {
  emit('selectedItem', id)
  switch (target) {
    case 'parent': {
      if (props.disableItemOnClicked == 'parent') return;
      selected.value = id
      selectedTarget.value = target
      break
    }
    case 'child': {
      if (props.disableItemOnClicked == 'child') return;
      if (props.overrideChildClicked) {
        props.overrideChildClicked()
        return
      }
      selected.value = id
      selectedTarget.value = target
      bottomSheetToggle()
      break
    }
  }
}

function handleEsc(event: KeyboardEvent) {
  if (event.key === "Escape") {
    bottomSheetToggle(false)
    filterBottomSheetToggle(false)
  }
}

function onDeletePressCallback() {
  deleteAllPressToggle()
}

function isChecked(id: string): boolean {
  return checkedList.value.findIndex(i => i === id) > -1
}

function addChecked(id: string) {
  const idx = checkedList.value.findIndex(i => i === id)
  if (idx > -1) {
    checkedList.value = checkedList.value.filter(i => i !== id)
  } else {
    checkedList.value = [...checkedList.value, id]
  }
}

function removeChecked() {
  checkedList.value.forEach(async v => {
    await props.remove(v)
  })
}

function filterClicked() {
  filterBottomSheetToggle()
}

function bottomSheetCloseHandler() {
  bottomSheetToggle(false)
  filterBottomSheetToggle(false)
}

onLongPress(
  deleteAllRef,
  onDeletePressCallback,
  {
    modifiers: {
      prevent: true
    }
  }
)

onMounted(async () => {
  window.addEventListener("keydown", handleEsc)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc)
})
</script>

<style scoped></style>
