<script lang="ts" setup>
import { useChartDataStore } from '@/stores/download/useChartDataStore';



const chartData = useChartDataStore()
</script>

<template>
  <div class="mx-5 mb-6">
    <div class="flex items-center justify-between text-sm mb-1">
      <span class="text-foreground/70">{{ chartData.downloadProgress }}</span>
      <span class="text-foreground/70">{{ chartData.downloadTimeRemaining }}</span>
    </div>
    <div class="w-full h-1.5 bg-foreground/10 rounded-full">
      <div class="h-full bg-emerald-500 rounded-full" :style="{ width: chartData.downloadProgress }" />
    </div>
  </div>
</template>