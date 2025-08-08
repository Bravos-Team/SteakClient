<template>
  <Toaster />
  <SidebarProvider>
    <div class="flex w-full">
      <MainSidebar />
      <MainContent class="flex-1 bg-[#101014]" />
    </div>
  </SidebarProvider>
</template>
<script setup lang="ts">
import { SidebarProps, SidebarProvider } from '@/components/ui/sidebar'
import MainSidebar from './MainSidebar.vue'
import MainContent from './MainContent.vue'
import { useUseFromIpc } from '@/composables/useUseFromIpc'
import { Toaster } from '@/components/ui/sonner'
const QueueStore = useDownloadQueueStore()

import 'vue-sonner/style.css'
import { useDownloadQueueStore } from '@/stores/download/useDownloadStore'
import { onBeforeMount, onMounted } from 'vue'
onBeforeMount(async () => {
  await useUseFromIpc()
  const info = await window.api.getDMQueueInformation()
  QueueStore.updateAll({
    elements: info.elements,
    finished: info.finished,
    state: info.state,
  })
})

</script>
