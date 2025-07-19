import { dialog, Notification } from 'electron'
import { getMainWindow } from '../main_window'
import {  configPath, homePath } from '../constants/path'

export type DialogProperty =
  | 'openFile'
  | 'openDirectory'
  | 'multiSelections'
  | 'showHiddenFiles'
  | 'createDirectory'
  | 'promptToCreate'
  | 'noResolveAliases'
  | 'treatPackageAsDirectory'
  | 'dontAddToRecent'
export interface DialogOptions {
  title?: string
  defaultPath?: string
  filters?: { name: string; extensions: string[] }[]
  properties?: Partial<Record<DialogProperty, boolean>>
}

async function showDialog(options: DialogOptions): Promise<string[]> {
  const mainWindow = getMainWindow()
  if (!mainWindow) throw new Error('Main window not available')

  const props = Object.entries(options.properties || {})
    .filter(([, value]) => value)
    .map(([key]) => key as DialogProperty)

  const result = await dialog.showOpenDialog(mainWindow, {
    title: options.title,
    defaultPath: options.defaultPath,
    filters: options.filters,
    properties: props,
  })
  console.log(`Dialog result: ${configPath}`)

  console.log(`homePath: ${homePath}`)

  return result.canceled ? [] : result.filePaths
}

type NotifyType = {
  title: string
  body: string
}
let currentNotify: Notification | null = null
function notify({ title, body }: NotifyType) {
  const main_window = getMainWindow()
  if (Notification.isSupported()) {
    if (currentNotify){
      currentNotify.close() // Close the previous notification if it exists
      currentNotify = null
    }
    const notify = new Notification({
      title,
      body,
    })
    notify.on('click', () => {
      if (main_window) {
        main_window.show()
      }
    })
    notify.show()
    currentNotify = notify
  }
}
export { showDialog  , notify }
