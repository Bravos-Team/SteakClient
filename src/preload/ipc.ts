

import { ipcRenderer, type IpcRendererEvent } from 'electron'
import { AsyncIPCFunctions, FrontendMessages, SyncIPCFunctions } from 'src/common/types/ipc'



type PromiseOnce<T> = T extends Promise<unknown> ? T : Promise<T>

function makeListenerCaller<ChannelName extends keyof SyncIPCFunctions>(channel: ChannelName) {
  return (...args: Parameters<SyncIPCFunctions[ChannelName]>) => ipcRenderer.send(channel, ...args)
}

function makeHandlerCaller<ChannelName extends keyof AsyncIPCFunctions>(channel: ChannelName) {
  return (...args: Parameters<AsyncIPCFunctions[ChannelName]>) =>
    ipcRenderer.invoke(channel, ...args) as PromiseOnce<ReturnType<AsyncIPCFunctions[ChannelName]>>
}

function frontendListenerSlot<ChannelName extends keyof FrontendMessages>(channel: ChannelName) {
  return (
    listener: (e: IpcRendererEvent, ...args: Parameters<FrontendMessages[ChannelName]>) => void,
  ) => {
    const wrapped = (event: IpcRendererEvent, ...args: unknown[]) => {
      listener(event, ...(args as Parameters<FrontendMessages[ChannelName]>))
    }
    ipcRenderer.on(channel, wrapped)
    return () => {
      ipcRenderer.removeListener(channel, wrapped)
    }
  }
}

export { makeListenerCaller, makeHandlerCaller, frontendListenerSlot }
