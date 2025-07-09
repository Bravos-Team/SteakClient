<script lang="ts" setup>
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, RefreshCcw, ArrowUpFromLine } from 'lucide-vue-next'
import { ref, onMounted, onBeforeUnmount, computed, Ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import { useNavigation } from '@/composables/useNavigation'
import { useDownloadQueueStore, useDownloadStore } from '@/stores/download/useDownloadStore'
import { DMQueueElement, DownloadManagerState, GameStatus } from '@/types/type'

const { handleNavigation } = useNavigation()
const QueueStore = useDownloadQueueStore()
const DownloadStore = useDownloadStore()
onMounted(async () => {
  // Initialize the chart library
  window.api.handleDMQueueInformation(
    async (
      e: any,
      elements: DMQueueElement[],
      finished: DMQueueElement[],
      state: DownloadManagerState,
    ) => {
      QueueStore.updateAll({ elements, finished, state })
    },
  )
  const info = await window.api.getDMQueueInformation()
  QueueStore.updateAll({
    elements: info.elements,
    finished: info.finished,
    state: info.state,
  })
  window.api.handleGameStatus((e: any, payload: GameStatus) => {
    DownloadStore.setGameStatus(payload)
    console.log('Game status updated:', payload)
    console.log(DownloadStore.getProgress())
  })
})

console.log('QueueStore initialized with:', {
  elements: QueueStore.elements,
  finished: QueueStore.finished,
  state: QueueStore.state,
})

const QueueInfo = computed(() => {
  return {
    elements: QueueStore.elements,
    finished: QueueStore.finished,
    state: QueueStore.state,
  }
})
const firsELement = computed(() => {
  return QueueStore.elements[0]
})
console.log('First element:', firsELement.value)

const remainingElements = computed(() => {
  return QueueStore.elements.slice(1)
})
console.log('Remaining elements:', remainingElements.value)

const finishedElements = computed(() => {
  return QueueStore.finished
})
console.log('Finished elements:', finishedElements.value)

async function pauseDownload(appName: string) {
  await window.api.pausedDownload(appName)
  console.log(`Paused download for ${appName}`)
}
async function resumeDownload(app_name: string) {
  await window.api.resumeDownload(app_name)
  console.log('Resumed download')
}
async function cancelDownload(appName: string) {
  await window.api.cancelDownload(appName)
  console.log(`Cancelled download for ${appName}`);
}
async function removeFinished(appName: string) {
  await window.api.removeFinished(appName)
  console.log(`Removed finished download for ${appName}`);
}
// Biểu đồ ApexCharts
const chartOptions = ref({
  chart: {
    id: 'download-speed-chart',
    height: 50,
    type: 'line',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 500,
      },
    },
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    sparkline: {
      enabled: true,
    },
  },
  colors: ['#2dd4bf', '#ff6b6b'],
  stroke: {
    curve: 'straight',
    width: 4,
  },
  markers: {
    size: 0,
  },
  tooltip: {
    enabled: false,
  },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0,
    },
  },
  xaxis: {
    type: 'numeric',
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    min: 0,
  },
})
// Proxy(Object) {bytes: '216237092', eta: '0m 8s', downSpeed: '38106602.409638554', diskWriteSpeed: '38270265.87637595', percent: 40.85614515786536}[[Handler]]: MutableReactiveHandler[[Target]]: Object[[IsRevoked]]: false
const formatSpeed = (bytesPerSecond: number): string =>
  `${(bytesPerSecond / 1048576).toFixed(2)} MB/s`

const formatProgress = (percent: number, totalBytes: number): string => {
  const totalMB = totalBytes / 1048576
  return `${percent.toFixed(2)}% [${totalMB.toFixed(2)}MB]`
}
const progressPercent = computed(() => {
  return `${(infoProgress.value?.percent || 0).toFixed(2)}%`
})
const convertEta = (eta: string): string => {
  const [minutes, seconds] = eta.split(' ').map((t) => parseInt(t.replace(/[a-z]/g, '')))
  const mm = String(minutes || 0).padStart(2, '0')
  const ss = String(seconds || 0).padStart(2, '0')
  return `00:${mm}:${ss}`
}
const infoProgress = computed(() => {
  return DownloadStore.getProgress()
})
// Test data
// const downloadSpeed = ref('10.81 MB/s')
// const diskSpeed = ref('20.31 MB/s')
// const downloadProgress = ref('6.91% [107.51MB]')
// const downloadTimeRemaining = ref('00:01:13')

const downloadSpeed = computed(() => formatSpeed(parseFloat(infoProgress.value?.downSpeed || '0')))
const diskSpeed = computed(() => formatSpeed(parseFloat(infoProgress.value?.diskWriteSpeed || '0')))
const downloadProgress = computed(() => {
  const percent = infoProgress.value?.percent || 0
  const totalBytes = parseFloat(infoProgress.value?.bytes || '0')
  return formatProgress(percent, totalBytes)
})
const downloadTimeRemaining = computed(() => {
  const eta = infoProgress.value?.eta || '0m 0s'
  return convertEta(eta)
})
function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
}
const MAX_POINTS = 20

const pushSeriesData = (seriesRef: Ref<any>, value: number) => {
  const series = seriesRef.value[0]
  series.data.push(value)
  if (series.data.length > MAX_POINTS) {
    series.data.shift()
  }
}


const downloadSeries = ref([
  {
    name: 'Download',
    data: Array(20)
      .fill(0)
  },
])

const diskSeries = ref([
  {
    name: 'Disk',
    data: Array(20)
      .fill(0)
  },
])
watchEffect(() => {
  const down = parseFloat(infoProgress.value?.downSpeed || '0') / 1048576
  const disk = parseFloat(infoProgress.value?.diskWriteSpeed || '0') / 1048576
if(down== 0 && disk === 0) {
  downloadSeries.value[0].data = Array(20).fill(0)
  diskSeries.value[0].data = Array(20).fill(0)
    return
  }
  pushSeriesData(downloadSeries, down)
  pushSeriesData(diskSeries, disk)
})
let chartUpdateInterval: number | null = null

// More realistic game download simulation
onMounted(() => {
  // // Initialize with more realistic starting values
  // const baseDownloadSpeed = 12 // Base speed in MB/s
  // const baseDiskSpeed = 18 // Base disk write speed in MB/s
  // let currentDownloadSpeed = baseDownloadSpeed + (Math.random() * 2 - 1)
  // let currentDiskSpeed = baseDiskSpeed + (Math.random() * 3 - 1.5)
  // chartUpdateInterval = window.setInterval(() => {
  //   // Simulate fluctuations in network conditions
  //   // Network speed tends to fluctuate more than disk speed
  //   currentDownloadSpeed += Math.random() * 0.9 - 0.4 // Small random adjustment
  //   // Occasional larger fluctuations (network congestion)
  //   if (Math.random() < 0.1) {
  //     // 10% chance of larger fluctuation
  //     currentDownloadSpeed += Math.random() * 2 - 1
  //   }
  //   // Keep speeds within realistic bounds
  //   currentDownloadSpeed = Math.max(6, Math.min(20, currentDownloadSpeed))
  //   // Disk write speed is usually more consistent but affected by download speed
  //   currentDiskSpeed = baseDiskSpeed + (Math.random() * 1.5 - 0.75)
  //   currentDiskSpeed = Math.max(12, Math.min(30, currentDiskSpeed))
  //   // Update chart data
  //   const newDownloadData = [...downloadSeries.value[0].data.slice(1), currentDownloadSpeed]
  //   downloadSeries.value = [{ name: 'Download', data: newDownloadData }]
  //   const newDiskData = [...diskSeries.value[0].data.slice(1), currentDiskSpeed]
  //   diskSeries.value = [{ name: 'Disk', data: newDiskData }]
  //   // Update displayed speeds with formatting
  //   downloadSpeed.value = `${currentDownloadSpeed.toFixed(2)} MB/s`
  //   diskSpeed.value = `${currentDiskSpeed.toFixed(2)} MB/s`
  //   // Update progress
  //   const totalSize = 19.2 * 1024 // Total size in MB (from 19.2 GB)
  //   const downloadedSoFar = (parseFloat(downloadProgress.value.split('%')[0]) / 100) * totalSize
  //   const newDownloaded = downloadedSoFar + currentDownloadSpeed
  //   const newPercentage = ((newDownloaded / totalSize) * 100).toFixed(2)
  //   const newDownloadedFormatted = (newDownloaded / 1024).toFixed(2)
  //   downloadProgress.value = `${newPercentage}% [${newDownloadedFormatted}GB]`
  //   // Update time remaining
  //   const remainingMB = totalSize - newDownloaded
  //   const remainingSeconds = Math.floor(remainingMB / currentDownloadSpeed)
  //   const minutes = Math.floor(remainingSeconds / 60)
  //   const seconds = remainingSeconds % 60
  //   downloadTimeRemaining.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`
  // }, 1000)
})

onBeforeUnmount(() => {
  if (chartUpdateInterval) {
    clearInterval(chartUpdateInterval)
  }
})
</script>

<template>
  <!-- <div class="w-full flex flex-col">
    <div class="flex justify-between items-end w-full">
      <div class="flex justify-center pl-4 gap-4">
        <ArrowLeft class="cursor-pointer" @click="handleNavigation('back')" />
        <ArrowRight class="cursor-pointer" @click="handleNavigation('forward')" />
        <RefreshCcw class="cursor-pointer" @click="handleNavigation('refresh')" />
      </div>

      <div class="flex justify-center pr-4">
        <ArrowUpFromLine class="cursor-pointer" @click="handleNavigation('openInBrowser')" />
      </div>
    </div>
    <hr class="h-px mt-2 w-full bg-[#ffffff] border-0" />
  </div> -->

  <div class="bg-background p-0">
    <!-- Downloads Card -->
    <h1 class="text-xl font-semibold text-foreground/80 mx-5 mt-6 mb-4">Downloads</h1>

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

    <!-- Progress bar -->
    <div class="mx-5 mb-6">
      <div class="flex items-center justify-between text-sm mb-1">
        <span class="text-foreground/70">{{ downloadProgress }}</span>
        <span class="text-foreground/70">{{ downloadTimeRemaining }}</span>
      </div>
      <div class="w-full h-1.5 bg-foreground/10 rounded-full">
        <div class="h-full bg-emerald-500 rounded-full" :style="{width:progressPercent }"></div>
      </div>
    </div>

    <!-- Downloading Section -->
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Downloading</h2>

    <div class="mx-5 mb-6">
      <Card class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-0">
        <div class="px-4 bg-gray-900 dark:bg-gray-800/20 rounded-lg">
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
            <tbody class="text-sm" v-if="firsELement">
              <tr class="border-t border-border/20">
                <td class="py-3">
                  <div class="flex items-center">
                    <img
                      src="../assets/img/1.jpg"
                      alt="Game cover"
                      class="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <div class="font-medium text-sm">{{ firsELement.params.appName }}</div>
                      <div class="text-xs text-muted-foreground">{{ firsELement.status }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3">{{ formatTimestamp(firsELement.starTime || 0) }}</td>
                <td class="py-3">{{ firsELement.type }}</td>
                <td class="py-3">Epic Games</td>
                <td class="py-3 flex justify-center gap-2" v-if="QueueInfo.state === 'running'">
                  <!-- Cancel Button - Orange -->
                  <button @click="cancelDownload(firsELement.params.appName)"
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
                  <!-- Pause Button - Green -->
                  <button
                    @click="pauseDownload(firsELement.params.appName)"
                    class="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white"
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
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  </button>
                </td>
                <td
                  class="py-3 flex justify-center gap-2"
                  v-if="QueueInfo.state === 'paused' || QueueInfo.state === 'idle'"
                >
                  <!-- Cancel Button - Orange -->
                  <button  @click="cancelDownload(firsELement.params.appName)"
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
                  <!-- Resume Button - Blue -->
                  <button
                    @click="resumeDownload(firsELement.params.appName)"
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
              </tr>
            </tbody>
          </table>

          <div v-if="!firsELement" class="py-10 text-center text-muted-foreground">
            Nothing currently downloading
          </div>
        </div>
      </Card>
    </div>

    <!-- Queued Section -->
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Queued</h2>

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
                      src="../assets/img/1.jpg"
                      alt="Game cover"
                      class="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <div class="font-medium text-sm">{{ item.params.appName }}</div>
                      <div class="text-xs text-muted-foreground">{{ item.status }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3">{{ formatTimestamp(item.addToQueueTime || 0) }}</td>
                <td class="py-3">{{ item.type }}</td>
                <td class="py-3">"Epic Games"</td>
                <td class="py-3 flex justify-center gap-2" v-if="item.status === 'paused' || item.status ==='downloading'">
                  <!-- Cancel Button - Orange -->
                  <button @click="cancelDownload(item.params.appName)"
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
                  <!-- Resume Button - Blue -->
                  <button
                    @click="resumeDownload(item.params.appName)"
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
                  <!-- Remove Button - Orange -->
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

          <div v-if="remainingElements.length === 0" class="py-10 text-center text-muted-foreground">
            Nothing to download
          </div>
        </div>
      </Card>
    </div>
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Finish</h2>
    <div class="mx-5">
      <Card class="bg-card/20 backdrop-blur border border-border/10 rounded-lg p-0">
        <div class="px-4 bg-gray-900 dark:bg-gray-800/20 rounded-lg">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-sm font-medium text-foreground/70">
                <th class="text-left py-3 font-medium">Tựa game</th>
                <th class="text-left py-3 font-medium">End at</th>
                <th class="text-left py-3 font-medium">Type</th>
                <th class="text-left py-3 font-medium">Cửa hàng</th>
                <th class="text-center py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody class="text-sm" v-if="finishedElements.length > 0">
              <tr class="border-t border-border/20" v-for="(item, i) in finishedElements" :key="i">
                <td class="py-3">
                  <div class="flex items-center">
                    <img
                      src="../assets/img/1.jpg"
                      alt="Game cover"
                      class="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div>
                      <div class="font-medium text-sm">{{ item.params.appName }}</div>
                      <div class="text-xs text-muted-foreground">{{ item.status }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3">{{ formatTimestamp(item.endTime || 0) }}</td>
                <td class="py-3">{{ item.type }}</td>
                <td class="py-3">"Epic Games"</td>
                <td class="py-3 flex justify-center">
                  <!-- Remove Button - Orange -->
                  <button @click="removeFinished(item.params.appName)"
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

          <div v-if="finishedElements.length === 0" class="py-10 text-center text-muted-foreground">
            Nothing to download
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
