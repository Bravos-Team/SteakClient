import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path, { dirname } from 'node:path'
import started from 'electron-squirrel-startup'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { createMainWindow } from './main_window'
import { createLoginWindow, getLoginWindow } from './login_window'
import { UserInfo } from 'src/common/types/type'

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
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/main_window/index.html'))
  }
  return mainWindow
}

async function initializeLoginWindow(): Promise<BrowserWindow> {
  const loginWindow = createLoginWindow()
  loginWindow.loadURL(process.env.LOGIN_WINDOW_URL as string)
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

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
    title: 'Save File',
    defaultPath: '/home/tvt/Downloads',
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
      { name: 'Custom File Type', extensions: ['as'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })
  return canceled ? null : filePaths[0]
})
// ipcMain.handle('downloadEvent', async () => {
//   console.log('downloading')
//   const url = 'https://mmatechnical.com/Download/Download-Test-File/(MMA)-500MB.zip'
//   const dest = '/home/tvt/testdownload/'
//   try {
//     await downloadFile({ url, dest  })
//     console.log('Download complete')
//     return { success: true }
//   } catch (err) {
//     console.error('Download failed:', err)
//     return { success: false, error: (err as Error).message }
//   }
// })

ipcMain.on('dropped-file', (_event, filePath) => {
  console.log('File được kéo vào:', filePath)
})
addHandler('getHomePath', () => {
  console.log('Getting home path' + app.getPath('home'))

  return app.getPath('home')
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
import { addHandler } from './ipc'
