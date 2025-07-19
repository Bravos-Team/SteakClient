<script lang="ts" setup>
import { useDownloadManagerSync } from '@/hooks/useDownloadManagerSync'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import DownloadChart from '@/views/download/DownloadChart.vue'
import DownloadingTable from '@/views/download/DownloadingTable.vue'
import DownloadProgress from '@/views/download/DownloadProgress.vue'
import FinishedTable from '@/views/download/FinishedTable.vue'
import QueuedTable from '@/views/download/QueuedTable.vue'
import { onMounted } from 'vue'

const QueueStore = useDownloadQueueStore()
onMounted(async () => {
  const info = await window.api.getDMQueueInformation()
  QueueStore.updateAll({
    elements: info.elements,
    finished: info.finished,
    state: info.state,
  })
})
useDownloadManagerSync()
function handlePauseDownload(appName: string) {
  window.api.pausedDownload(appName)
  console.log(`Paused download for ${appName}`)
}
function handleResumeDownload(appName: string) {
  window.api.resumeDownload(appName)
  console.log('Resumed download')
}
function handleCancelDownload(appName: string) {
  window.api.cancelDownload(appName)
  console.log(`Cancelled download for ${appName}`)
}
function handleRemoveFinished(appName: string) {
  window.api.removeFinished(appName)
  console.log(`Removed finished download for ${appName}`)
}
</script>

<template>
  <div class="bg-background p-0">
    <h1 class="text-xl font-semibold text-foreground/80 mx-5 mt-6 mb-4">Downloads</h1>
    <DownloadChart />
    <DownloadProgress />
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Downloading</h2>
    <DownloadingTable
      :firstELement="QueueStore.elements[0]"
      @pause="handlePauseDownload"
      @cancel="handleCancelDownload"
      @resume="handleResumeDownload"
    />
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Queued</h2>
    <QueuedTable
      :remainingElements="QueueStore.elements.slice(1)"
      @cancel="handleCancelDownload"
      @resume="handleResumeDownload"
    />
    <h2 class="text-base font-semibold text-foreground/80 mx-5 mb-2">Finished</h2>
    <FinishedTable @remove="handleRemoveFinished" :finishedElements="QueueStore.finished" />
  </div>
</template>
