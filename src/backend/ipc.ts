import { ipcMain, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron'
import { AsyncIPCFunctions, FrontendMessages, SyncIPCFunctions } from 'src/common/types/ipc'
import { getMainWindow } from './main_window'

function addListener<ChannelName extends keyof SyncIPCFunctions>(
  channel: ChannelName,
  listener: (e: IpcMainEvent, ...args: Parameters<SyncIPCFunctions[ChannelName]>) => void,
) {
  ipcMain.on(channel, wrapHandler(listener))
}
function addOneTimeListener<ChannelName extends keyof SyncIPCFunctions>(
  channel: ChannelName,
  listener: (e: IpcMainEvent, ...args: Parameters<SyncIPCFunctions[ChannelName]>) => void,
) {
  ipcMain.once(channel, wrapHandler(listener))
}

function addHandler<ChannelName extends keyof AsyncIPCFunctions>(
  channel: ChannelName,
  handler: (
    e: IpcMainInvokeEvent,
    ...args: Parameters<AsyncIPCFunctions[ChannelName]>
  ) =>
    | ReturnType<AsyncIPCFunctions[ChannelName]>
    | Awaited<ReturnType<AsyncIPCFunctions[ChannelName]>>,
) {
  ipcMain.handle(channel, wrapHandler(handler))
}

function sendFrontendMessage<ChannelName extends keyof FrontendMessages>(
  channel: ChannelName,
  ...args: Parameters<FrontendMessages[ChannelName]>
): boolean {
  const mainWindow = getMainWindow()
  if (!mainWindow) return false

  mainWindow.webContents.send(channel, ...args)
  return true
}
function wrapHandler<Args extends unknown[], R>(
  handler: (...args: Args) => R,
): (...args: unknown[]) => R {
  return (...args: unknown[]) => handler(...(args as Args))
}

export { addListener, addOneTimeListener, addHandler, sendFrontendMessage }
