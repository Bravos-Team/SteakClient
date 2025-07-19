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
  <Suspense>
      <template #default>
        <RouterView />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
</template>
<script lang="ts" setup>
import { Toaster } from './components/ui/sonner';




</script>
