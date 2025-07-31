import { useSystemInfo } from '@/stores/util'

export async function useSystemIpc(path? : string) {
  const systemInfoStore = useSystemInfo()
  const info = await window.api.getSystemInfo(path)
  console.log('System Info:', info);
  
  systemInfoStore.setSystemInfo(info)
}
