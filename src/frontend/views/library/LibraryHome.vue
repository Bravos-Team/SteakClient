<template>
  <div class="flex mb-3">
    <div class="ml-4 w-full max-w-[500px]">
      <ComboboxSearch />
    </div>
  </div>
  <div class="w-full flex flex-1 flex-col h-full p-4 overflow-y-hidden">
    <div class="grid auto-rows-min gap-4 md:grid-cols-8">
      <div
        class="group/game transition-transform duration-300 hover:scale-105 flex flex-col aspect-[3/4] rounded-sm bg-muted/50 relative"
      >
        <!-- Ảnh nền -->
        <img
          class="grayscale group-hover/game:grayscale-0 transition-all h-5/6 w-full rounded-sm object-cover"
          src="https://cdn2.unrealengine.com/fortnite-blitz-royale-1920x1080-9946411a3a9f.jpg?resize=1&w=1920"
          alt=""
        />
        <div
          class="absolute bottom-10 left-0 flex items-center right-0  bg-[#202024]/30 backdrop-blur-sm text-white p-2 rounded-b-sm opacity-0 group-hover/game:opacity-100 group-hover/game:translate-y-0 translate-y-4 transition-all duration-300"
        >
          <h1 class="font-serif text-lg">Fortnite Blitz Royale</h1>
        </div>
        <div
          class="relative flex justify-between items-center h-2/12 bg-[#202024] w-full rounded-b-sm px-4"
        >
          <!-- Icon giữa -->
          <button @click="saveGame"
            class="absolute left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
          >
            <ArrowDownToLine class="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <div
        class="group/game transition-transform duration-300 hover:scale-105 flex flex-col aspect-[3/4] rounded-sm bg-muted/50 relative"
      >
        <img
          class="group-hover/game:grayscale-0 transition-all h-5/6 w-full rounded-sm object-cover"
          src="../../assets/image/backmythwukong.jpg"
          alt=""
        />
         <div
          class="absolute bottom-10 left-0 flex items-center right-0  bg-[#202024]/30 backdrop-blur-sm text-white p-2 rounded-b-sm opacity-0 group-hover/game:opacity-100 group-hover/game:translate-y-0 translate-y-4 transition-all duration-300"
        >
          <h1 class=" font-serif text-lg">Black Myth: Wukong</h1>
        </div>
        <div
          class="relative flex justify-between items-center h-2/12 bg-[#202024] w-full rounded-b-sm px-4"
        >
          <!-- Icon trái -->
          <button
            class="p-2 rounded-full bg-white/10 hover:bg-red-600 transition-all backdrop-blur-sm shadow hover:scale-105"
          >
            <Trash2 class="w-4 h-4 text-white" />
          </button>

          <!-- Icon giữa -->
          <button
            class="absolute left-1/2 -translate-x-1/2 p-3 rounded-full bg-white/10 hover:bg-green-600 transition-all backdrop-blur-sm shadow-lg hover:scale-105"
          >
            <Play class="w-5 h-5 text-white" />
          </button>

          <!-- Icon phải -->
          <button
            class="p-2 rounded-full bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow hover:scale-105"
          >
            <SlidersHorizontal class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <!-- <div class="aspect-[3/4] rounded-xl bg-muted/50" />
      <div class="aspect-[3/4] rounded-xl bg-muted/50" />
      <div class="aspect-[3/4] rounded-xl bg-muted/50" />
      <div class="aspect-[3/4] rounded-xl bg-muted/50" />
      <div class="aspect-[3/4] rounded-xl bg-muted/50" /> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import ComboboxSearch from '@/components/ComboboxSearch.vue'

import { Play, Trash2, SlidersHorizontal, ArrowDownToLine } from 'lucide-vue-next'
async function saveGame(){
  const fileName = await window.electronAPI.openFile()
  console.log(fileName)
}
</script>
