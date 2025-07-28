<!-- InstallInfoTab.vue -->
<template>
  <div class="mt-6 px-4 h-full w-full font-semibold text-white/75">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <CloudDownload class="w-6 h-6 mr-2" />
        <span>Download Size:</span>
      </div>
      <span class="text-[#00b8d4]">{{ formatSize(installParams.size || 0) }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <FolderDown class="w-6 h-6 mr-2" />
        <span>Install Size:</span>
      </div>
      <span class="text-[#00b8d4]">{{ formatSize(installParams.installSize || 0) }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div v-if="installParams.gameInfo.details.version" class="flex items-center justify-between">
      <div class="flex items-center">
        <CircleDot class="w-6 h-6 mr-2" />
        <span>Version:</span>
      </div>
      <span class="text-[#00b8d4]">{{ installParams.gameInfo.details.version }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <Wifi class="w-6 h-6 mr-2" />
        <span>Online Required:</span>
      </div>
      <span class="text-[#00b8d4]">{{ installParams.gameInfo.details.is_offline ? 'Yes' : 'No' }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
    <div v-if="installParams.gameInfo.details.save_path" class="flex items-center justify-between">
      <div class="flex items-center">
        <Cable class="w-6 h-6 mr-2" />
        <span>Save Path:</span>
      </div>
      <span class="text-[#00b8d4]">{{ installParams.gameInfo.details.save_path }}</span>
    </div>
    <div class="border-b border-gray-700 my-4"></div>
  </div>
</template>

<script setup lang="ts">
import { CloudDownload, FolderDown, CircleDot, Wifi, Cable } from 'lucide-vue-next'
import type { InstallParams } from '@/types/type'

defineProps<{
  installParams: InstallParams
}>()

const formatSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}
</script>