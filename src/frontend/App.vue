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

  <SidebarProvider>
    <Toaster />
    <AppSidebar />

    <SidebarInset>
      <HeaderHome />

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
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import { onMounted, ref } from 'vue'
import { UserInfo } from '@/types/type'
import { useAuthStore } from './stores/auth/useAuthStore'

onMounted(() => {
  if (!window.api) {
    console.error('electronApi is not defined')
    return
  }
  console.log('Waiting for user info...')
  window.api.sendUserInfo((_event : any, user: UserInfo) => {
  console.log('User info received:', user)
  if (user) {
    useAuthStore().setUser(user)
  }
})
})
</script>
