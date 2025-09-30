<template>
  <Teleport to="#action-left-teleport">
    <button @click="() => console.log('search')"
      class="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
      <component :is="SearchIcon" />
    </button>
  </Teleport>
  <h2 class="text-lg font-bold text-gray-500">Assets</h2>
  <EmptyState v-if="!assets.length" message="Asset Not Available" class="p-5" />
  <ListItem v-else v-for="it in assets.slice(0, 3)" :key="it?.id" :id="it?.id || ''" :name="it?.name || ''"
    :subName="formatCurrency(it.meta?.restBalance ?? 0)">
    <template #icon>
      <div class="bg-slate-50 border-slate-200 border me-3 rounded-md p-2 shrink-0">
        <div class="flex items-center justify-center w-5 h-5">{{ it?.icon }}</div>
      </div>
    </template>
  </ListItem>
  <div class="bg-gray-100 rounded-sm">
    <DateNavigator :initial-date="initDateTransactionList" @update:date="updateDateNavigator" />
  </div>
  <SummarizerBoard class="rounded-md py-3" :income="income" income-title="Total Incomes" :outcome="expense"
    outcome-title="Total Expenses" />
  <div class="flex flex-1 items-center" v-if="!transactionsBySelectedDate.length">
    <EmptyState message="Transaction Not Available" />
  </div>
  <ListTableWithSwipe v-else :columns="columns" :items="transactionsBySelectedDate"
    @delete="v => deleteItem(v as Transaction)" @selected="v => selectedItem(v as Transaction)">
    <template #content="{ item }">
      <div class="flex flex-col gap-0.5">
        <div class="text-sm font-medium text-black">
          {{ item.notes }}
        </div>
        <div class="text-xs text-gray-400">
          {{ formatDateTime(item.time) }} .
          <span class="font-bold">{{ item.category.name }}</span>
        </div>
      </div>
    </template>

    <template #amount="{ item }">
      <div class="text-sm font-semibold" :class="[item.type == 'Outcome' ? 'text-red-500' : 'text-blue-500']">
        {{ formatCurrency(item.total) }} <br>
        <span class="text-xs text-gray-400">{{ item.asset.name }}</span>
      </div>
    </template>
  </ListTableWithSwipe>
  <component @click="goToTransaksiPage" :is="PlusCircleIcon"
    class="text-white size-14 fill-orange-500 absolute right-[1rem] bottom-[5rem]" />
</template>

<script setup lang="ts">
import { useTransactionStore, type Transaction } from '@/stores/transactionStore';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { localData, setLocalData } from '@/stores/localDataStore';
import { useAssetStore } from '@/stores/assetStore';
import type { } from '@/types';
import DateNavigator from '@/components/DateNavigator.vue';
import SummarizerBoard from '@/components/SummarizerBoard.vue';
import { formatCurrency, formatDateTime } from '@/utils/format';
import { PlusCircleIcon, SearchIcon } from 'lucide-vue-next';
import ListTableWithSwipe, { type Column } from '@/components/ListTableWithSwipe.vue';
import ListItem from '@/components/ListItem.vue';
import { flattenItemGroup } from '@/utils/array';
import EmptyState from '@/components/EmptyState.vue';

const transactionStore = useTransactionStore()
const assetStore = useAssetStore()
const router = useRouter()

const transactions = ref<Transaction[]>([])
const income = ref(0)
const expense = ref(0)

const initDateTransactionList = computed(() => (localData.value.selectedDate ? new Date(localData.value.selectedDate) : new Date()))

const assets = computed(() => {
  // Sort hanya sekali di sini
  const sortedTransactions = [...transactionStore.transactions].sort(
    (a, b) => a.time.getTime() - b.time.getTime()
  )

  return flattenItemGroup(assetStore.assets).map(v => {
    const lastUsed = sortedTransactions.find(t => t.asset.id === v.id)
    const restBalance = sortedTransactions.reduce((sum, t) => {
      if (t.asset.id === v.id) {
        if (t.type === 'Outcome') {
          return sum + parseInt(t.total)
        }
        if (t.type === 'Income') {
          return sum - parseInt(t.total)
        }
      }
      return sum
    }, 0)
    if (v.meta) {
      v.meta.lastUsed = lastUsed?.time.toISOString()
      v.meta.restBalance = (v.meta.balance || 0) - restBalance
    }
    return v
  }).sort((a, b) => (b.meta?.restBalance || 0) - (a.meta?.restBalance || 0)).filter(a => a.meta?.restBalance !== 0)
})

const selectedItem = (item: Transaction) => {
  setLocalData({ ...localData.value, selectedTransactionItem: item })
  router.push('transaction?action=edit')
}

const deleteItem = (item: Transaction) => {
  if (item.id) transactionStore.remove(item.id);
  transactions.value = transactions.value.filter(v => v.id != item.id)
}

const columns: Column[] = [
  { key: 'content' },
  { key: 'amount', width: '30%', align: 'right' },
]

const transactionsBySelectedDate = computed(() => {
  const d = new Date(localData.value.selectedDate || "")
  return isNaN(d.getTime())
    ? []
    : transactions.value.filter(v => (v.time as Date).toDateString() === d.toDateString())
})

function goToTransaksiPage() {
  router.push({ path: 'transaction' })
}

function updateDateNavigator(d: Date) {
  localData.value.selectedDate = d.toISOString()
}

watch(transactionsBySelectedDate, (tx) => {
  income.value = 0
  expense.value = 0
  tx.forEach(v => {
    if (v.type == 'Income') {
      income.value += parseInt(v.total as string)
    } else if (v.type == 'Outcome') {
      expense.value += parseInt(v.total as string)
    }
  })
})

onBeforeMount(() => {
  delete localData.value.selectedTransactionItem
  setLocalData(localData.value)
})

onMounted(async () => {
  await assetStore.fetchAll()
  transactions.value = await transactionStore.fetchAll()
})

</script>
