<template>
  <div class="flex h-screen">
    <div
      class="w-1/8 flex flex-col bg-white dark:bg-[#101014] text-white p-4 space-y-8 items-center border-r border-gray-600"
    >
      <div class="">
        <a class="" href="#">
          <img class="h-[75px]" :src="'https://ccdn.steak.io.vn/logo_steak.svg'" alt="Logo" />
        </a>
      </div>
      <nav class="h-full w-full flex flex-col space-y-2">
        <a href="#" class="hover:text-gray-300 p-2">Dashboard</a>
        <a href="#" class="hover:text-gray-300">Settings</a>
        <a href="#" class="hover:text-gray-300">Logout</a>
      </nav>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive } from 'vue'

const versions = reactive({
  chrome: '',
  node: '',
  electron: '',
})

onMounted(() => {
  console.log('Home.vue mounted')
  const api = window.myElectronAPI?.versions()
  console.log('electronAPI:', api)
  versions.chrome = api?.chrome ?? ''
  versions.node = api?.node ?? ''
  versions.electron = api?.electron ?? ''
})
</script>
