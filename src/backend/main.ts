import { app, BrowserWindow } from 'electron'
import path, { dirname } from 'node:path'
import started from 'electron-squirrel-startup'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { createMainWindow } from './main_window'
import { addHandler } from './ipc'
import { electronRendererUrl } from './constants/url'
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
if (process.platform === 'linux')
  app.commandLine.appendSwitch('--disable-features', 'UsePortalDialogs')

app.whenReady().then(async () => {
  try {
    if (process.platform === 'darwin') {
      app.setAppUserModelId('steak')
    }

    const main_window = await initializeMainWindow()
    // console.log(configPath)
    // console.log(await getSystemInfo())
    
    main_window.show()

    main_window.focus()
  } catch (error) {
    console.error('Failed to initialize window:', error)
    app.quit()
  }
})

addHandler('openWebViewDevTools', (event, webviewId: string) => {
  console.log(`Opening DevTools for webview with ID: ${webviewId}`)

  const webview = document.getElementById(webviewId) as Electron.WebviewTag

  if (webview) {
    webview.openDevTools()
  } else {
    console.error(`Webview with ID ${webviewId} not found`)
  }
})
addHandler('getHomePath', () => {
  return app.getPath('home')
})
addHandler('getSystemInfo', async (_e, path?: string) => {
  return (await getSystemInfo(path)).systemInfo
})
addHandler('getCapacitySystem', async (e, path?: string) => {
  const { totalSize, freeSize } = await getCapacitySystem(path)
  return { totalSize, freeSize }
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
import './auth/ipc'
import { getCapacitySystem, getSystemInfo } from './utils'
import { WINEGE_URL } from './wine/constants'
import { fetchReleases } from './wine/util'
import { CommonDependencies, VersionInfo, WineArchitecture, WineInstallInfo } from './wine/type'
import { WineManager } from './wine/manager'
import { homePath } from './constants/path'
