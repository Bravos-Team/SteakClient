import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChartDataStore = defineStore('chartData', () => {
  const downloadSpeed = ref('10.81 MB/s')
  const diskSpeed = ref('20.31 MB/s')
  const downloadProgress = ref('6.91% [107.51MB]')
  const downloadTimeRemaining = ref('00:01:13')

  const chartOptions = ref({
    chart: {
      id: 'download-speed-chart',
      height: 70,
      type: 'line',
      animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 500 } },
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: true },
    },
    colors: ['#2dd4bf', '#ff6b6b'],
    stroke: { curve: 'straight', width: 2 },
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

  const downloadSeries = ref([
    {
      name: 'Download',
      data: Array(20)
        .fill(0)
        .map((_, i) => 12 + Math.sin(i / 3) * 2 + (Math.random() * 1.5 - 0.75)),
    },
  ])

  const diskSeries = ref([
    {
      name: 'Disk',
      data: Array(20)
        .fill(0)
        .map((_, i) => 18 + Math.sin(i / 4) * 1 + (Math.random() * 1 - 0.5)),
    },
  ])

  let chartUpdateInterval: number | null = null
  let tick = 0
  const baseDownloadSpeed = 200
  const baseDiskSpeed = 220
  let currentDownloadSpeed = baseDownloadSpeed + (Math.random() * 2 - 1)
  let currentDiskSpeed = baseDiskSpeed + (Math.random() * 3 - 1.5)

  function startChartUpdates() {
    chartUpdateInterval = window.setInterval(() => {
      tick += 1
      currentDownloadSpeed =
        baseDownloadSpeed + Math.sin(tick / 5) * 50 + (Math.random() * 100 - 50)
      if (Math.random() < 0.2) currentDownloadSpeed += Math.random() * 150 - 75
      currentDownloadSpeed = Math.max(50, Math.min(500, currentDownloadSpeed))

      currentDiskSpeed = baseDiskSpeed + Math.sin(tick / 6) * 30 + (Math.random() * 80 - 40)
      currentDiskSpeed = Math.max(50, Math.min(500, currentDiskSpeed))

      downloadSeries.value = [
        {
          name: 'Download',
          data: [...downloadSeries.value[0].data.slice(1), currentDownloadSpeed],
        },
      ]
      diskSeries.value = [
        { name: 'Disk', data: [...diskSeries.value[0].data.slice(1), currentDiskSpeed] },
      ]

      downloadSpeed.value = `${currentDownloadSpeed.toFixed(2)} MB/s`
      diskSpeed.value = `${currentDiskSpeed.toFixed(2)} MB/s`

      const totalSize = 19.2 * 1024
      const downloadedSoFar = (parseFloat(downloadProgress.value.split('%')[0]) / 100) * totalSize
      const newDownloaded = downloadedSoFar + currentDownloadSpeed
      const newPercentage = ((newDownloaded / totalSize) * 100).toFixed(2)
      const newDownloadedFormatted = (newDownloaded / 1024).toFixed(2)

      downloadProgress.value = `${newPercentage}% [${newDownloadedFormatted}GB]`

      const remainingMB = totalSize - newDownloaded
      const remainingSeconds = Math.floor(remainingMB / currentDownloadSpeed)
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      downloadTimeRemaining.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:00`
    }, 1000)
  }

  function stopChartUpdates() {
    if (chartUpdateInterval) {
      clearInterval(chartUpdateInterval)
      chartUpdateInterval = null
    }
  }

  return {
    downloadSpeed,
    diskSpeed,
    downloadProgress,
    downloadTimeRemaining,
    chartOptions,
    downloadSeries,
    diskSeries,
    startChartUpdates,
    stopChartUpdates,
  }
})
