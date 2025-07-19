<template>
  <SidebarInset>
    <HeaderHome />
    <RouterView />
  </SidebarInset>
</template>
<script setup lang="ts">
import HeaderHome from '@/components/home/HeaderHome.vue'
import { SidebarInset } from '@/components/ui/sidebar'
</script>
