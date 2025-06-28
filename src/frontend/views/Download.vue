<script lang="ts" setup>
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ref } from 'vue'

// Test data
const downloadSpeed = ref('23.62 MB/s')
const diskSpeed = ref('0 MB/s')
const downloadProgress = ref('6.91% [107.51MB]')
const downloadTimeRemaining = ref('00:01:13')
const currentDownloads = ref([
  {
    name: 'Ogu And The Secret Forest',
    info: '19.2 GB | Windows',
    startedAt: '6/26/2025 2:57 PM',
    type: 'Install',
    store: 'Epic Games'
  }
])
const queuedDownloads = ref([
  {
    name: 'Game 1',
    info: '10 GB | Windows',
    startedAt: '6/26/2025 2:57 PM',
    type: 'Install',
    store: 'Epic Games'
  },
  {
    name: 'Game 2',
    info: '15 GB | Windows',
    startedAt: '6/26/2025 2:57 PM',
    type: 'Install',
    store: 'Epic Games'
  }
])
</script>

<template>
  <div class="min-h-screen bg-background p-0">
    <!-- Downloads Card -->
    <h1 class="text-xl font-semibold text-foreground/80 mx-5 mt-6 mb-4">Downloads</h1>

    <div class="mx-5 mb-6">
      <Card class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-5">
        <div class="flex items-center">
          <div class="flex-1 h-12 flex items-end">
            <div class="w-full h-1 bg-sky-500/30 rounded"></div>
          </div>
          <div class="flex flex-col items-end ml-8">
            <span class="text-lg font-bold text-sky-400 leading-none">{{ downloadSpeed }}</span>
            <span class="text-xs text-muted-foreground">Download</span>
          </div>
          <div class="flex flex-col items-end ml-8">
            <span class="text-lg font-bold text-sky-400 leading-none">{{ diskSpeed }}</span>
            <span class="text-xs text-muted-foreground">Disk</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- Progress bar -->
    <div class="mx-5 mb-6">
      <div class="flex items-center justify-between text-sm mb-1">
        <span class="text-foreground/70">{{ downloadProgress }}</span>
        <span class="text-foreground/70">{{ downloadTimeRemaining }}</span>
      </div>
      <div class="w-full h-1.5 bg-foreground/10 rounded-full">
        <div class="h-full bg-emerald-500 rounded-full" style="width: 6.91%"></div>
      </div>
    </div>

    <!-- Downloading Section -->
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Downloading</h2>

    <div class="mx-5 mb-6">
      <Card class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-0">
        <div class="px-4 bg-gray-900 dark:bg-gray-800 rounded-lg">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-sm font-medium text-foreground/70">
                <th class="text-left py-3 font-medium">Tựa game</th>
                <th class="text-left py-3 font-medium">Started at</th>
                <th class="text-left py-3 font-medium">Type</th>
                <th class="text-left py-3 font-medium">Cửa hàng</th>
                <th class="text-center py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody class="text-sm" v-if="currentDownloads.length > 0">
              <tr class="border-t border-border/20" v-for="(item, i) in currentDownloads" :key="i">
                <td class="py-3">
                  <div class="flex items-center">
                    <img src="../assets/img/1.jpg" alt="Game cover" class="w-12 h-12 object-cover rounded mr-3">
                    <div>
                      <div class="font-medium text-sm">{{ item.name }}</div>
                      <div class="text-xs text-muted-foreground">{{ item.info }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3">{{ item.startedAt }}</td>
                <td class="py-3">{{ item.type }}</td>
                <td class="py-3">{{ item.store }}</td>
                <td class="py-3 flex justify-center gap-2">
                  <!-- Cancel Button - Orange -->
                  <button
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <!-- Pause Button - Green -->
                  <button
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="currentDownloads.length === 0" class="py-10 text-center text-muted-foreground">
            Nothing currently downloading
          </div>
        </div>
      </Card>
    </div>

    <!-- Queued Section -->
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Queued</h2>

    <div class="mx-5">
      <Card class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-0">
        <div class="px-4 bg-gray-900 dark:bg-gray-800 rounded-lg">
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
                    <img src="../assets/img/1.jpg" alt="Game cover" class="w-12 h-12 object-cover rounded mr-3">
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
                  <!-- Remove Button - Orange -->
                  <button
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
      </Card>
    </div>
  </div>
</template>