<script lang="ts" setup>
import { computed } from 'vue'
import { useDownloadQueueStore, useGameStatusStore } from '@/stores/download/useDownloadStore'

const GameStatusStore = useGameStatusStore()
const DownloadQueueStore = useDownloadQueueStore()
const infoProgress = computed(() => GameStatusStore.getProgress(DownloadQueueStore.getQueue()[0]?.params.id.toString() || ''))
const progressPercent = computed(() => `${(infoProgress.value?.percent || 0).toFixed(2)}%`)
const downloadProgress = computed(() => {
  const percent = infoProgress.value?.percent || 0
  const totalBytes = parseFloat(infoProgress.value?.bytes || '0')
  return formatProgress(percent, totalBytes)
})
const downloadTimeRemaining = computed(() => {
  const eta = infoProgress.value?.eta || '0m 0s'
  return convertEta(eta)
})

const formatProgress = (percent: number, totalBytes: number): string => {
  const totalMB = totalBytes / 1048576
  return `${percent.toFixed(2)}% [${totalMB.toFixed(2)}MB]`
}
const convertEta = (eta: string): string => {
  const [minutes, seconds] = eta.split(' ').map((t) => parseInt(t.replace(/[a-z]/g, '')))
  const mm = String(minutes || 0).padStart(2, '0')
  const ss = String(seconds || 0).padStart(2, '0')
  return `00:${mm}:${ss}`
}
</script>

<template>
  <div class="mx-5 mb-6">
    <div class="flex items-center justify-between text-sm mb-1">
      <span class="text-foreground/70">{{ downloadProgress }}</span>
      <span class="text-foreground/70">{{ downloadTimeRemaining }}</span>
    </div>
    <div class="w-full h-1.5 bg-foreground/10 rounded-full">
      <div class="h-full bg-emerald-500 rounded-full" :style="{ width: progressPercent }"></div>
    </div>
  </div>
</template>