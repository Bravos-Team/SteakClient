<script lang="ts" setup>
import { useChartDataStore } from '@/stores/download/useChartDataStore'
import { onMounted, onBeforeUnmount } from 'vue'
import VueApexCharts from 'vue3-apexcharts'


const chartData = useChartDataStore()

onMounted(() => chartData.startChartUpdates())
onBeforeUnmount(() => chartData.stopChartUpdates())
</script>

<template>
  <div class="mx-5 mb-6">
    <div class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-5">
      <div class="flex items-center">
        <div class="flex-1 h-12 flex items-end relative">
          <div class="w-full absolute right-0 bottom-0 h-12">
            <VueApexCharts
              width="100%"
              height="70"
              type="line"
              :options="chartData.chartOptions"
              :series="[...chartData.downloadSeries, ...chartData.diskSeries]"
            />
          </div>
          <div class="w-full h-0.5 bg-sky-500/30 rounded"></div>
        </div>
        <div class="flex flex-col items-end ml-8 z-10">
          <span class="text-lg font-bold text-sky-400 leading-none">{{ chartData.downloadSpeed }}</span>
          <span class="text-xs text-muted-foreground">Download</span>
        </div>
        <div class="flex flex-col items-end ml-8 z-10">
          <span class="text-lg font-bold text-sky-400 leading-none">{{ chartData.diskSpeed }}</span>
          <span class="text-xs text-muted-foreground">Disk</span>
        </div>
      </div>
    </div>
  </div>
</template>