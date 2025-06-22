import { contextBridge, ipcRenderer } from 'electron'

const validChannels = ['login-username', 'login-success']

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: any) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  on: (channel: string, func: (...args: any[]) => void) => {
    if (validChannels.includes(channel)) {
      // Loại bỏ event arg để tránh leak
      const subscription = (_event: any, ...args: any[]) => func(...args)
      ipcRenderer.on(channel, subscription)
      return () => ipcRenderer.removeListener(channel, subscription)
    }
  },
})
