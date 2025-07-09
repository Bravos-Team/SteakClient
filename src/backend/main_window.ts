import { BrowserWindow, screen } from 'electron'

import path, { dirname } from 'path'

import { fileURLToPath } from 'url'
import { WindowProps } from '@/types/type'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
let windowProps: WindowProps | null = null
let mainWindow: BrowserWindow | null = null

export const getMainWindow = () => {
  if (mainWindow) return mainWindow
  return BrowserWindow.getAllWindows().at(0)
}
export const createMainWindow = () => {
  windowProps = {
    height: 600,
    width: 1200,
    x: 0,
    y: 0,
    maximize: false,
  } as WindowProps

  const screenInfo = screen.getPrimaryDisplay()
  if (screenInfo?.workAreaSize?.height < windowProps.height) {
    windowProps.height = screenInfo.workAreaSize.height * 0.8
  }
  if (screenInfo?.workAreaSize?.width < windowProps.width) {
    windowProps.width = screenInfo.workAreaSize.width * 0.8
  }

  mainWindow = new BrowserWindow({
    ...windowProps,
    minHeight: 345,
    minWidth: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      sandbox: false,
      preload: path.join(__dirname, './index.js'),
    },
  })
  // mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Content-Security-Policy': [contentSecurityPolicy],
  //     },
  //   })
  // })
  return mainWindow
}
