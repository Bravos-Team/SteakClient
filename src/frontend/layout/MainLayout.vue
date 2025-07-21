<template>
  <Toaster />
  <SidebarProvider>
    <div class="flex w-full h-screen">
      <MainSidebar />
      <MainContent />
    </div>
  </SidebarProvider>
</template>
<script setup lang="ts">
import { SidebarProps, SidebarProvider } from '@/components/ui/sidebar'
import MainSidebar from './MainSidebar.vue'
import MainContent from './MainContent.vue'
import { useUseFromIpc } from '@/hooks/useUseFromIpc'
import { Toaster } from '@/components/ui/sonner'
const QueueStore = useDownloadQueueStore()

import 'vue-sonner/style.css'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
useUseFromIpc()
const info = await window.api.getDMQueueInformation()
QueueStore.updateAll({
  elements: info.elements,
  finished: info.finished,
  state: info.state,
})
</script>
