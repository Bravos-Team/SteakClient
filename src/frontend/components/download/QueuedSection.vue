<script lang="ts" setup>
import { ref } from 'vue'

const queuedDownloads = ref([
  {
    name: 'Game 1',
    info: '10 GB | Windows',
    startedAt: '6/26/2025 2:57 PM',
    type: 'Install',
    store: 'Epic Games',
    img : '/src/frontend/assets/img/1.jpg',
  },
  {
    name: 'Game 2',
    info: '15 GB | Windows',
    startedAt: '6/26/2025 2:57 PM',
    type: 'Install',
    store: 'Epic Games',
    img : '/src/frontend/assets/img/1.jpg',
  },
])

</script>

<template>
  <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Queued</h2>
  <div class="mx-5">
    <div class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-0">
      <div class="px-4 bg-gray-900 dark:bg-gray-800/20 rounded-lg">
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-sm font-medium text-foreground/70">
              <th class="text-left py-3 font-medium">Tựa game</th>
              <th class="text-left py-3 font-medium">Added at</th>
              <th class="text-left py-3 font-medium">Type</th>
              <th class="text-left py-3 font-medium">Cửa hàng</th>
              <th class="text-center py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody class="text-sm" v-if="queuedDownloads.length > 0">
            <tr class="border-t border-border/20" v-for="(item, i) in queuedDownloads" :key="i">
              <td class="py-3">
                <div class="flex items-center">
                  <img
                    :src="item.img"
                    alt="Game cover"
                    class="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <div class="font-medium text-sm">{{ item.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ item.info }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3">{{ item.startedAt }}</td>
              <td class="py-3">{{ item.type }}</td>
              <td class="py-3">{{ item.store }}</td>
              <td class="py-3 flex justify-center">
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="queuedDownloads.length === 0" class="py-10 text-center text-muted-foreground">
          Nothing to download
        </div>
      </div>
    </div>
  </div>
</template>