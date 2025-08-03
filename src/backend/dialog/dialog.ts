import { dialog, Notification } from 'electron'
import { getMainWindow } from '../main_window'
import { configPath, homePath } from '../constants/path'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
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
  icon?: string
}
let currentNotify: Notification | null = null
function notify({ title, body, icon }: NotifyType) {
  const main_window = getMainWindow()
  if (Notification.isSupported()) {
    const pathicon = icon || path.join(__dirname, '../../frontend/assets/logo.svg.ico')
    console.log(pathicon)

    if (currentNotify) {
      currentNotify.close() // Close the previous notification if it exists
      currentNotify = null
    }
    const notify = new Notification({
      title,
      body,
      icon: icon || pathicon,
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
export { showDialog, notify }
