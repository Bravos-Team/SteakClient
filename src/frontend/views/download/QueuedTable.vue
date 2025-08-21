<script lang="ts" setup>
import { Card } from '@/components/ui/card'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import { DMQueueElement } from '@/types/type'
import { computed } from 'vue'

const formatTimestamp = (ts: number): string => {
  const d = new Date(ts)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}

defineEmits(['resume', 'cancel'])
defineProps<{
  remainingElements: DMQueueElement[]
}>()
</script>

<template>
  <div class="mx-5">
    <Card class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-0">
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
          <tbody class="text-sm" v-if="remainingElements.length > 0">
            <tr class="border-t border-border/20" v-for="(item, i) in remainingElements" :key="i">
              <td class="py-3">
                <div class="flex items-center">
                  <img
                    :src="item.params.gameInfo.details.thumbnail"
                    alt="Game cover"
                    class="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <div class="font-medium text-sm">{{ item.params.gameInfo.details.title }}</div>
                    <div class="text-xs text-muted-foreground">{{ item.status }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3">{{ formatTimestamp(item.addToQueueTime || 0) }}</td>
              <td class="py-3">{{ item.type }}</td>
              <td class="py-3">Epic Games</td>
              <td
                class="py-3 flex justify-center gap-2"
                v-if="item.status === 'paused' || item.status === 'downloading'"
              >
                <button
                  @click="$emit('cancel', item.params.id)"
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
                <button
                  @click="$emit('resume', item.params.id)"
                  class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white"
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
                    <path d="M18 6l-6 6 6 6" />
                  </svg>
                </button>
              </td>
              <td class="py-3 flex justify-center" v-else>
                <button
                  @click="$emit('cancel', item.params.id)"
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
        <div v-if="remainingElements.length === 0" class="py-10 text-center text-muted-foreground">
          Nothing to download
        </div>
      </div>
    </Card>
  </div>
</template>
