import { BrowserWindow, Menu, screen } from 'electron'

import path, { dirname } from 'path'

import { fileURLToPath } from 'url'
import { WindowProps } from 'src/common/types/type'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
let windowProps: WindowProps | null = null
let loginWindow: BrowserWindow | null = null

export const getLoginWindow = () => {
  if (loginWindow) return loginWindow
  return BrowserWindow.getAllWindows().at(0)
}
export const createLoginWindow = () => {
  windowProps = {
    height: 1080,
    width: 1440,
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

  loginWindow = new BrowserWindow({
    ...windowProps,
    minHeight: 960,
    minWidth: 600,
    show: false,
    autoHideMenuBar: true ,
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

  const menu =Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          click: () => {
            loginWindow?.close()
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            loginWindow?.webContents.reload()
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            loginWindow?.webContents.toggleDevTools()
          },
        },
      ],
    },
  ])
  Menu.setApplicationMenu(menu)
  return loginWindow
}
