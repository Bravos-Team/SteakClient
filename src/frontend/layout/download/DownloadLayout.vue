<script lang="ts" setup>
import { useDownloadManagerSync } from '@/composables/useDownloadManagerSync'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import DownloadChart from '@/views/download/DownloadChart.vue'
import DownloadingTable from '@/views/download/DownloadingTable.vue'
import DownloadProgress from '@/views/download/DownloadProgress.vue'
import FinishedTable from '@/views/download/FinishedTable.vue'
import QueuedTable from '@/views/download/QueuedTable.vue'
import { onMounted } from 'vue'

const QueueStore = useDownloadQueueStore()
const info = await window.api.getDMQueueInformation()
QueueStore.updateAll({
  elements: info.elements,
  finished: info.finished,
  state: info.state,
})
useDownloadManagerSync()
function handlePauseDownload(id: string) {
  window.api.pausedDownload(id)
  console.log(`Paused download for ${id}`)
}
function handleResumeDownload(id: string) {
  window.api.resumeDownload(id)
  console.log(`Resumed download for ${id}`)
}
function handleCancelDownload(id: string) {
  window.api.cancelDownload(id)
  console.log(`Cancelled download for ${id}`)
}
function handleRemoveFinished(id: string) {
  window.api.removeFinished(id)
  console.log(`Removed finished download for ${id}`)
}
</script>

<template>
  <div class="bg-background h-full p-0">
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
