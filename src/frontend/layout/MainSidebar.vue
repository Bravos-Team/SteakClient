<template>
  <Sidebar v-bind="props">
    <SidebarHeader class="flex my-6 p-0 justify-center items-center">
      <!-- <TeamSwitcher :teams="data.teams" /> -->
      <img
        class="h-[3rem] w-[3rem] p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
        src="https://ccdn.steak.io.vn/logo_steak.svg"
        alt=""
      />
    </SidebarHeader>
    <div class="flex items-center justify-center">
      <hr class="h-px mb-2 w-full mr-4 ml-4 bg-[#ffffff] border-0" />
    </div>
    <SidebarContent> <NavMain :items="navMain" /> </SidebarContent>
    <SidebarFooter>
      <NavMain class="pb-4" :items="navFooter" />
    </SidebarFooter>
  </Sidebar>
</template>
<script setup lang="ts">
import NavMain from '@/components/NavMain.vue'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProps } from '@/components/ui/sidebar'
import { navFooter, navMain } from '@/constants/sidebarData'
const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
  
})
</script>
