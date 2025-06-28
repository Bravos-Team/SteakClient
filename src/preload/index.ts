import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile : () => ipcRenderer.invoke("dialog:openFile"),
  sendDroppedFile :(filePath :string) => ipcRenderer.send('dropped-file', filePath)
  })
