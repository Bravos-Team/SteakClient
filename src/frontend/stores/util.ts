import { SystemInfo } from '@/types/type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemInfo = defineStore('systemInfo', () => {
  const systemInfo = ref<SystemInfo | null>(null)
    const setSystemInfo = (info: SystemInfo) => {
        systemInfo.value = info
    }
  const getSystemInfo = () => {
    return systemInfo.value
  }
  return { systemInfo, setSystemInfo, getSystemInfo }
})
