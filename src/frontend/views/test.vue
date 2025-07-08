<template>
    
  <div class="bg-amber-800" v-if="status">
    <p>{{ status.status }}</p>
    <p>{{ status.progress?.percent?.toFixed(1) }}%</p>
    <p>{{ status.progress?.downSpeed }} /s</p>
    <p>{{ status.progress?.diskWriteSpeed }} /s</p>
    <p>Còn lại: {{ status.progress?.eta }}</p>
  </div>

  <button  @click="handleInstallEldenRing">Install Game elden-ring</button>
  <button @click="pauseDownload('elden-ring')">Pause Download</button>
  <button @click="resumeDownload()">Resume Download</button>
  <button @click="handleInstallWukong">Install Game Wukong</button>
  <button @click="pauseDownload('Wukong')">Pause Download Wukong</button>
  <button @click="cancelDownload('elden-ring')">Cancel Download</button>
  <button @click="cancelDownload('Wukong')">Cancel Download Wukong</button>

</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { nextTick } from 'vue'
import { useDownloadQueueStore, useDownloadStore } from '@/stores/download/useDownloadStore'
import { DMQueueElement, DownloadManagerState, GameStatus } from '@/types/type'
import { storeToRefs } from 'pinia'

const store = useDownloadStore()




onMounted( () => {
  
  // Giả sử bạn muốn lấy trạng thái của game "elden-ring"
 
  window.api.handleGameStatus(( e : any, payload : GameStatus) => {
    store.updateGameStatus(payload)
    console.log( 'Game status updated:', payload);
    
  })
  
  window.api.handleDMQueueInformation((e: any,  elements :DMQueueElement[] ,state :DownloadManagerState ) => {
   
    console.log('📦 Queue Elements:', elements)
    console.log('🔁 Current State:', state)
  })
  


})

const status = computed(() => store.statuses['elden-ring'] || store.statuses['Wukong'] || null)
async function handleInstallEldenRing() {
  await nextTick()
  await window.api.install({
    appName: 'elden-ring',
    path: '/path/to/elden-ring',
    gameInfo: {
      app_name: 'elden-ring',
      install: {
        executable: 'elden-ring.exe',
        install_path: '/path/to/elden-ring',
        install_size: '5000000000', // 5 GB
        
      },
      installable: true,
      is_installed: false,
      title: 'Elden Ring',
    },
  })
}
async function handleInstallWukong() {
  await nextTick()
  await window.api.install({
    appName: 'Wukong',
    path: '/path/to/Wukong',
    gameInfo: {
      app_name: 'Wukong',
      install: {
        executable: 'elden-ring.exe',
        install_path: '/path/to/elden-ring',
        install_size: '5000000000', // 5 GB
        
      },
      installable: true,
      is_installed: false,
      title: 'Wukong',
    },
  })
}
async function cancelDownload(appName: string) {
  await window.api.cancelDownload(appName)
  console.log(`Cancelled download for ${appName}`);
}
async function pauseDownload(appName: string) {
  await window.api.pausedDownload(appName)
  console.log(`Paused download for ${appName}`);
}
async function resumeDownload() {
  await window.api.resumeDownload()
  console.log('Resumed download');
}
const info = await window.api.getDMQueueInformation()
  console.log('📦 Queue Elements:', info.elements)
  console.log('✅ Finished Elements:', info.finished)
  console.log('🔁 Current State:', info.state)



</script>
