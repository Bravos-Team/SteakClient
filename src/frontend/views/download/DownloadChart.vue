<template>
  <div class="mx-5 mb-6">
    <Card class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-5">
      <div class="flex items-center">
        <div class="flex-1 h-12 flex items-end relative">
          <!-- Chart -->
          <div class="w-full absolute right-0 bottom-0 h-12">
            <VueApexCharts
              width="100%"
              height="70"
              type="line"
              :options="chartOptions"
              :series="[...downloadSeries, ...diskSeries]"
            />
          </div>
          <div class="w-full h-0.5 bg-sky-500/30 rounded"></div>
        </div>
        <div class="flex flex-col items-end ml-8 z-10">
          <span class="text-lg font-bold text-sky-400 leading-none">{{ downloadSpeed }}</span>
          <span class="text-xs text-muted-foreground">Download</span>
        </div>
        <div class="flex flex-col items-end ml-8 z-10">
          <span class="text-lg font-bold text-sky-400 leading-none">{{ diskSpeed }}</span>
          <span class="text-xs text-muted-foreground">Disk</span>
        </div>
      </div>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { useDownloadStore } from '@/stores/download/useDownloadStore'
import { computed, Ref, ref, watchEffect } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const DownloadStore = useDownloadStore()
const MAX_POINTS = 20
// Biểu đồ ApexCharts
const chartOptions = ref({
  chart: {
    id: 'download-speed-chart',
    height: 50,
    type: 'line',
    animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 500 } },
    toolbar: { show: false },
    zoom: { enabled: false },
    sparkline: { enabled: true },
  },
  colors: ['#2dd4bf', '#ff6b6b'],
  stroke: { curve: 'straight', width: 4 },
  markers: { size: 0 },
  tooltip: { enabled: false },
  grid: { show: false, padding: { left: 0, right: 0 } },
  xaxis: {
    type: 'numeric',
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { show: false, min: 0 },
})
const downloadSeries = ref([{ name: 'Download', data: Array(20).fill(0) }])
const diskSeries = ref([{ name: 'Disk', data: Array(20).fill(0) }])

const infoProgress = computed(() => DownloadStore.getProgress())
const downloadSpeed = computed(() => formatSpeed(parseFloat(infoProgress.value?.downSpeed || '0')))
const diskSpeed = computed(() => formatSpeed(parseFloat(infoProgress.value?.diskWriteSpeed || '0')))

const formatSpeed = (bytesPerSecond: number): string =>
  `${(bytesPerSecond / 1048576).toFixed(2)} MB/s`

const pushSeriesData = (seriesRef: Ref<any>, value: number) => {
  const series = seriesRef.value[0]
  series.data.push(value)
  if (series.data.length > MAX_POINTS) series.data.shift()
}

watchEffect(() => {
  const down = parseFloat(infoProgress.value?.downSpeed || '0') / 1048576
  const disk = parseFloat(infoProgress.value?.diskWriteSpeed || '0') / 1048576
  if (down === 0 && disk === 0) {
    downloadSeries.value[0].data = Array(20).fill(0)
    diskSeries.value[0].data = Array(20).fill(0)
    return
  }
  pushSeriesData(downloadSeries, down)
  pushSeriesData(diskSeries, disk)
})
</script>
