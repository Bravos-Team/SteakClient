import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path, { dirname } from 'node:path'
import started from 'electron-squirrel-startup'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { createMainWindow } from './main_window'
import { createLoginWindow, getLoginWindow } from './login_window'
import { addHandler, addListener, sendFrontendMessage } from './ipc'
import { configPath } from './constants/path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}
config()

async function initializeMainWindow(): Promise<BrowserWindow> {
  const mainWindow = createMainWindow()
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(electronRendererUrl)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/main_window/index.html'))
  }
  return mainWindow
}

async function initializeLoginWindow(): Promise<BrowserWindow> {
  const loginWindow = createLoginWindow()
  loginWindow.loadURL(steakLoginUrl)
  
  return loginWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
if (process.platform === 'linux')
  app.commandLine.appendSwitch('--disable-features', 'UsePortalDialogs')

app.whenReady().then(async () => {
  try {
    if (process.platform === 'darwin') {
      app.setAppUserModelId('steak-client-app')
    }
    const main_window = await initializeMainWindow()
    console.log(configPath)
    main_window.show()
  } catch (error) {
    console.error('Failed to initialize window:', error)
    app.quit()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})




addHandler('getHomePath', () => {
  return app.getPath('home')
})
addListener('openLoginWindow', async () => {
  const loginWindow = await initializeLoginWindow()
  loginWindow.show()
  loginWindow.focus()
})
addHandler('login', async (e, userInfo: UserInfo) => {
  const loginWindow = getLoginWindow()
  sendFrontendMessage('sendUserInfo', userInfo)
  if (loginWindow) {
    loginWindow.close()
  }
})

export const contentSecurityPolicy =
  process.env.APP_CSP ??
  [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://api.steak.io.vn",
    "img-src 'self' blob: file:  https://ccdn.steak.io.vn https://cdn2.unrealengine.com https://cdn1.epicgames.com",
    'frame-src https://develop.steak.io.vn',
  ].join('; ')

import './download/ipc'
import './dialog/ipc_handler'
import { UserInfo } from 'src/common/types/type'
import { electronRendererUrl, steakLoginUrl } from './constants/url'

