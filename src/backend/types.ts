import { TitleBarOverlay } from 'electron'

export interface WindowProps extends Electron.Rectangle {
  maximize: boolean
  frame?: boolean
  titleBarStyle?: 'default' | 'hidden' | 'hiddenInset'
  titleBarOverlay: TitleBarOverlay | boolean
}
