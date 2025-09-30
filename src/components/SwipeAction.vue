<template>
  <div class="w-full max-w-md mx-auto mt-10">
    <div class="relative overflow-hidden bg-white rounded shadow" @touchstart="onTouchStart" @touchmove="onTouchMove"
      @touchend="onTouchEnd">
      <!-- Tombol aksi (muncul di belakang konten) -->
      <div class="absolute inset-y-0 right-0 flex">
        <button class="bg-red-500 text-white px-4">Delete</button>
        <button class="bg-blue-500 text-white px-4">Edit</button>
      </div>

      <!-- Konten yang digeser -->
      <div class="p-4 transition-transform duration-200" :style="{ transform: `translateX(${translateX}px)` }">
        Geser ke kiri untuk aksi
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const startX = ref(0)
const translateX = ref(0)
const threshold = 80 // jarak minimal swipe untuk memunculkan aksi

function onTouchStart(e: TouchEvent) {
  startX.value = e.touches[0].clientX
}

function onTouchMove(e: TouchEvent) {
  const currentX = e.touches[0].clientX
  translateX.value = Math.min(0, currentX - startX.value) // hanya geser ke kiri
}

function onTouchEnd() {
  if (Math.abs(translateX.value) > threshold) {
    translateX.value = -120 // geser untuk menampilkan tombol
  } else {
    translateX.value = 0 // kembali ke posisi awal
  }
}
</script>
