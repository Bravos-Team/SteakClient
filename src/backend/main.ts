import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path, { dirname } from 'node:path'
import started from 'electron-squirrel-startup'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let loginWin: BrowserWindow | null = null
let mainWin: BrowserWindow | null = null
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

const loginWindow = () => {
  // Create the browser window.
  loginWin = new BrowserWindow({
    width: 1280,
    height: 960,
    title: 'Login',
    icon: path.join(__dirname, './favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
  })

  // if (process.env.NODE_ENV === 'development') {
  //     console.log('Loading Vite dev server');
  //     mainWindow.loadURL('http://localhost:5173').catch(err => {
  //       console.error('Failed to load dev server:', err);
  //     });
  //   } else {
  //     const indexPath = path.join(__dirname, '../../dist/index.html');
  //     console.log('Loading file:', indexPath);
  //     mainWindow.loadFile(indexPath).catch(err => {
  //       console.error('Failed to load index.html:', err);
  //     });
  //   }
  loginWin.loadURL('http://localhost:5173/publisher/login')

  loginWin.webContents.openDevTools()
  // CSP để tăng bảo mật
  loginWin.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.steak.io.vn; img-src 'self' https://ccdn.steak.io.vn;",
        ],
      },
    })
  })
}

const mainWindow = () => {
  const screenInfo = screen.getPrimaryDisplay()
  let width = 1200
  let height = 690
  if (screenInfo?.workAreaSize?.height < height) {
    height = screenInfo.workAreaSize.height * 0.8
  }

  if (screenInfo?.workAreaSize?.width < width) {
    width = screenInfo.workAreaSize.width * 0.8
  }
  mainWin = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    x: 0,
    y: 0,
    resizable: true,
    title: 'main',
    icon: path.join(__dirname, './favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    maximizable: false,
  })

  // if (process.env.NODE_ENV === 'development') {
  //     console.log('Loading Vite dev server');
  //     mainWindow.loadURL('http://localhost:5173').catch(err => {
  //       console.error('Failed to load dev server:', err);
  //     });
  //   } else {
  const indexPath = path.join(__dirname, '../../dist/index.html')
  console.log('Loading file:', indexPath)
  mainWin.loadFile(indexPath).catch((err) => {
    console.error('Failed to load index.html:', err)
  })
  //   }

  mainWin.webContents.openDevTools()
  // CSP để tăng bảo mật
  mainWin.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.steak.io.vn; img-src 'self' https://ccdn.steak.io.vn;",
        ],
      },
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  console.log('Screen size:', width, height)
  loginWindow()
  ipcMain.on('login-username', (event, username: string) => {
    console.log('Đăng nhập thành công:', username)
    if (loginWin) {
      loginWin.hide()
    }
    if (!mainWin) {
      mainWindow()
      mainWin?.once('ready-to-show', () => {
        const size = mainWin?.getSize()
        const scaleFactor = screen.getPrimaryDisplay().scaleFactor
        console.log('Scale factor:', scaleFactor)
        mainWin?.setSize(1920 / scaleFactor, 960 / scaleFactor)
        console.log(321)
        mainWin?.show()
        mainWin?.webContents.send('login-success', username)
      })
    } else {
      console.log(123)
      mainWin.show()
      mainWin?.setSize(1920, 960)
      mainWin.webContents.send('login-success', username)
    }
  })
  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      loginWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
