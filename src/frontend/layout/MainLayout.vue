<template>
  <Toaster />
  <SidebarProvider v-bind="props">
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
import 'vue-sonner/style.css' 
useUseFromIpc()

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})
</script>
