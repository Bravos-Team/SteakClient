<template>
  <SidebarInset>
    <HeaderHome />
    <RouterView />
  </SidebarInset>
</template>
<script setup lang="ts">
import HeaderHome from '@/components/home/HeaderHome.vue'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
</script>
