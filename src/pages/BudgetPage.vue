<template>
  <div class="absolute inset-0 z-50 flex flex-col bg-white p-5 space-y-2" id="transaction-list"
    v-if="showTransactionList">
  </div>
  <ManageableItems :data="budgetFormatted" :fetchAll="budgetStore.fetchAll" :getById="budgetStore.getById"
    :add="budgetStore.add" :update="budgetStore.update" :remove="budgetStore.remove"
    :override-child-clicked="() => toggleShowTransactionList()" @selected-item="id => selectedItem = id"
    :list-auto-open="true">
    <template v-slot:form="{ data }">
      <FormRowSelector input number="plain" label="Amount" name="meta.balance"
        :model-value="`${data?.meta?.balance ?? ''}`" />
      <FormRowSelector label="Category"
        :model-value="`${selectedCategories.length ? getNameCategoryByIDs(selectedCategories) : getNameCategoryByIDs(data?.meta?.categories ?? [])}`">
        <template v-slot:customInputTitle>
          <h4 class="font-medium mb-3 text-slate-500 text-md">Select category to bind with budget</h4>
        </template>
        <template v-slot:customInput>
          <ItemCheck
            :data="[...restCategories, ...getCategoryByIDs(data?.meta?.categories ?? []).map(m => ({ id: m.id, name: m.name }))]"
            v-model="selectedCategories" formName="meta.categories[]"
            @vue:mounted="selectedCategories = data?.meta?.categories ?? []" />
        </template>
      </FormRowSelector>
      <FormRowSelector label="Cycle" :modelValue="data?.meta?.cycle ?? selectedCycle">
        <template v-slot:customInputTitle>
          <h4 class="font-medium mb-3 text-slate-500 text-md">Select Cycle</h4>
        </template>
        <template v-slot:customInput>
          <SelectedOptionSlide class="bg-slate-100 rounded-sm border-1 border-slate-200" formName="meta.cycle"
            :data="['Monthly', 'Daily', 'Weekly']" @update:selected="v => selectedCycle = v.toString()" />
        </template>
      </FormRowSelector>
    </template>
    <template v-slot:spacesub="{ data }">
      <div class="space-y-2">
        <ItemChips v-if="data.meta?.categories?.length" size="xs"
          :items="getNameCategoryByIDs(data.meta?.categories!)" />
        <PercentageBar :percent="data.meta?.calculation?.percentage || 0" :leftValue="data.meta?.calculation?.used || 0"
          :rightValue="data.meta?.calculation?.remaining || 0" left-class="font-medium text-red-400"
          right-class="font-medium text-blue-500" />
        <Teleport to="#transaction-list" v-if="showTransactionList && selectedItem.includes(data.id)">
          <div class="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-md p-3">
            <h5 class="text-slate-500">List Item</h5>
            <component :is="CircleXIcon" class="text-slate-400" @click="toggleShowTransactionList()" />
          </div>
          <div class="flex flex-1 items-center" v-if="!agregatedTransactions(data.meta?.categories || []).length">
            <EmptyState message="Belum ada transaksi"
              description="Transaksi akan muncul di sini setelah Anda menambahkannya" :icon="InboxIcon" />
          </div>
          <ListTable v-else :columns="columns" :items="agregatedTransactions(data.meta?.categories!)">
            <template #content="{ item }">
              <div class="flex flex-col gap-0.5">
                <div class="text-sm font-medium text-black">
                  {{ item.title }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ formatDateTime(item.time) }} .
                  <span class="font-bold">{{ item.category }}</span>
                </div>
              </div>
            </template>
            <template #amount="{ item }">
              <div class="text-sm font-semibold"
                :class="[item.type == 'Pengeluaran' ? 'text-red-500' : 'text-blue-500']">
                {{ formatCurrency(item.amount) }} <br>
                <span class="text-xs text-gray-400">{{ item.asset }}</span>
              </div>
            </template>
          </ListTable>
        </Teleport>
      </div>
    </template>
  </ManageableItems>
</template>

<script setup lang="ts">
import EmptyState from '@/components/EmptyState.vue';
import FormRowSelector from '@/components/FormRowSelector.vue';
import ItemCheck from '@/components/ItemCheck.vue';
import ItemChips from '@/components/ItemChips.vue';
import ListTable, { type Column } from '@/components/ListTable.vue';
import ManageableItems from '@/components/ManageableItems.vue';
import PercentageBar from '@/components/PercentageBar.vue';
import SelectedOptionSlide from '@/components/SelectedOptionSlide.vue';
import { useBudgetStore, type MetaType } from '@/stores/budgetStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionStore } from '@/stores/transactionStore';
import type { ItemGroup } from '@/types';
import { flattenItemGroup } from '@/utils/array';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { useToggle } from '@vueuse/core';
import { CircleXIcon, InboxIcon } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const selectedCategories = ref<string[]>([])
const selectedCycle = ref('Monthly')
const selectedItem = ref('')
const [showTransactionList, toggleShowTransactionList] = useToggle()

const transactions = ref<Record<string, string | number | Date>[]>([])

const columns: Column[] = [
  { key: 'content' },
  { key: 'amount', width: '30%', align: 'right' },
]

function getNameCategoryByIDs(ids: string[]) {
  const flat = categoryStore.categories.flatMap(g => [
    { id: g.id, name: g.name },
    ...(g.items ? g.items.map(m => ({ id: m.id, name: m.name })) : []),
  ])
  // buat lookup dictionary { id: name }
  const dict = Object.fromEntries(flat.map(item => [item.id, item.name]))
  return ids.map(d => dict[d])
}

function getCategoryByIDs(ids: string[]) {
  const flat = flattenItemGroup(categoryStore.categories)
  // buat lookup dictionary { id: name }
  const dict = Object.fromEntries(flat.map(item => [item.id, item]))
  return ids.map(d => dict[d])
}

function agregatedTransactions(categories: string[]) {
  return transactions.value.filter(t => {
    return categories.includes(t.categoryId as string)
  })
}

function totalAgregatedTransactions(categories: string[]) {
  let total: number = 0
  agregatedTransactions(categories).forEach(v => {
    total += parseInt(v.amount as string)
  })
  return total
}

const budgetFormatted = computed(() =>
  budgetStore.budget.map(e => {
    const percentage = budgetStore.calculateBudgetUsage(e.meta?.balance as number, totalAgregatedTransactions(e.meta?.categories || []))
    const mapped = {
      ...e,
      subName: formatCurrency(e.meta?.balance || 0),
      items: [{
        id: e.id,
        name: '',
        meta: {
          ...e.meta,
          calculation: {
            percentage: percentage.percentUsed,
            remaining: percentage.remaining,
            used: percentage.used,
          }
        }
      } as ItemGroup<MetaType>]
    }
    return mapped
  })
)

const restCategories = computed(() => {
  if (!budgetFormatted.value.length) return categoryStore.categories

  const usedIds = new Set(
    budgetFormatted.value.flatMap(el => el.meta?.categories ?? [])
  )

  function walk(list: ItemGroup[]): ItemGroup[] {
    return list.flatMap(g => [
      ...(usedIds.has(g.id) ? [] : [{ id: g.id, name: g.name }]),
      ...(g.items ? walk(g.items) : []),
    ])
  }

  return walk(categoryStore.categories)
})

onMounted(async () => {
  budgetStore.fetchAll()
  categoryStore.fetchAll()
  await transactionStore.fetchAll().then(val => {
    val.forEach(v => {
      transactions.value = [...transactions.value, {
        type: v.type,
        title: v.notes,
        categoryId: v.category.id,
        category: v.category.name,
        amount: v.total,
        asset: v.asset.name,
        time: v.time,
      }]
    })
  })
})
</script>
