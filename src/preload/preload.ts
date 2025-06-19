import { contextBridge, ipcMain, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI',{
  sendUserNameLogin : (username : string) => ipcRenderer.send('login-username',username),
 onLoginSuccess: (callback: (event: Electron.IpcRendererEvent, args: any) => void) => {
    ipcRenderer.on('login-success', callback)
  }
})

