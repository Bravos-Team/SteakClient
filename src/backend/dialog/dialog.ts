import { dialog } from 'electron'
import { getMainWindow } from '../main_window'

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

  return result.canceled ? [] : result.filePaths
}
export {
    showDialog,
}