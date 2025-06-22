<!-- <template>
  <toaster />
  <Suspense>
    <template #default>
      <router-view></router-view>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template> -->
<template>
  <SidebarProvider >
    <AppSidebar />
    <SidebarInset>
      <HeaderHome :user="data.user" />
      <Suspense>
        <template #default>
          <RouterView />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </SidebarInset>
  </SidebarProvider>
</template>
<script lang="ts" setup>
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import HeaderHome from '@/components/home/HeaderHome.vue'
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
}
</script>
