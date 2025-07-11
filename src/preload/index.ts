import { contextBridge, ipcRenderer, shell } from 'electron'

import api from './api'
import { UserInfo } from 'src/common/types/type'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  sendDroppedFile: (filePath: string) => ipcRenderer.send('dropped-file', filePath),
  downloadHandle: () => ipcRenderer.invoke('downloadEvent'),
  loginWindowHandle: (data: UserInfo) => ipcRenderer.send('loginWindow', data),
  onUserInfo: (callback: (data: UserInfo) => void) => {
    console.log('onUserInfo called')

    ipcRenderer.on('userinfo', (_event, data: UserInfo) => {
      console.log('Received user info:', data)

      callback(data)
    })
  },
  openExternal: (url: string) => shell.openExternal(url),
})

contextBridge.exposeInMainWorld('api', api)
contextBridge.exposeInMainWorld('platform', process.platform)
