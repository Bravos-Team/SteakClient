<template>
  <DialogContent v-if="!isFetching" class="sm:max-w-[750px] p-8">
    <DialogHeader>
      <DialogTitle class="flex gap-8 font-semibold items-center text-3xl">
        {{ installParams.gameInfo?.details?.title || '' }} <AppWindow class="w-6 h-6" />
      </DialogTitle>
      <DialogDescription class="my-2">
        <span class="flex items-center gap-4">
          <Download class="w-8 h-8" />
          <span class="flex flex-col">
            <span class="text-lg font-semibold">Download size</span>
            <span class="text-sm text-muted-foreground">
              {{ formatSize(installParams.installSize || 0) }}
            </span>
          </span>
          <CircleDot class="w-8 h-8" />
          <span class="flex flex-col">
            <span class="text-lg font-semibold">Version</span>
            <span class="text-sm text-muted-foreground">1.0.0</span>
          </span>
        </span>
      </DialogDescription>
    </DialogHeader>
    <div class="flex flex-col gap-4">
      <span class="flex items-center w-full">
        <Input v-model="installParams.path" class="px-4 h-12 text-lg rounded-r-none" />
        <button
          @click="$emit('open-folder')"
          class="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-blue-500 transition-all backdrop-blur-sm shadow-lg rounded-r-md"
        >
          <Folder class="w-6 h-6" />
        </button>
      </span>
      <span v-if="installParams.path">
        Free space: <span class="text-green-500 font-semibold">{{ formatSize(capacityDisks.freeSize) }}</span> /
        <span class="text-red-500 font-semibold">{{ formatSize(capacityDisks.totalSize) }}</span> - After installation, remaining:
        <span class="text-red-500 font-semibold">{{ formatSize(capacityDisks.remaining) }}</span>
      </span>
    </div>
    <DialogFooter class="flex mt-12 gap-2 justify-end">
      <Button variant="outline" class="w-32 h-12 text-lg hover:text-blue-500"> Enter Save</Button>
      <Button
        @click="$emit('install', installParams)"
        variant="default"
        class="w-32 h-12 text-lg hover:bg-green-500"
        :disabled="isInstalling || isFetching"
      >
        {{ isInstalling ? 'Installing...' : 'Install' }}
      </Button>
    </DialogFooter>
  </DialogContent>
</template>
<script lang="ts" setup>
import { ref, toRaw, computed } from 'vue'
import { toast } from 'vue-sonner'
import ComboboxSearch from '@/components/ComboboxSearch.vue'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DownloadInfo, GameDetails, GameLibrary, InstallParams } from '@/types/type'
import { Download, AppWindow, CircleDot, Folder } from 'lucide-vue-next'

import GameCard from '@/components/library/GameCard.vue'

import { useGameLibrary } from '@/composables/useGameLibraryIpc'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import {
  useGetGameDownloadInfo,
  useGetGameInfo,
  useGetLibraryList,
} from '@/hooks/library/useMyLibrary'
import { emit } from 'process'
function formatSize(bytes: number): string {
  if (bytes >= 1024 ** 4) return (bytes / 1024 ** 4).toFixed(2) + ' TB'
  if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB'
  if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return bytes + ' B'
}

defineProps<{
  installParams: InstallParams
  isInstalling: boolean
  isFetching: boolean
  capacityDisks: {
    totalSize: number
    freeSize: number
    remaining: number
  }
}>()

defineEmits<{
  (e: 'install', params: InstallParams): void
  (e: 'open-folder'): void
}>()
</script>
