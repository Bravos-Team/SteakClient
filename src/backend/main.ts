import { app, BrowserWindow, ipcMain } from 'electron'
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
  mainWin = new BrowserWindow({
    width: 1280,
    height: 960,
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
app.whenReady().then(loginWindow)

ipcMain.on('login-username', (_event, username) => {
  console.log("Đăng nhập thành công:",username);
  if(loginWin){
    loginWin.hide()
  }
  if(!mainWin){
    mainWindow()
  }else{
    mainWin.show()
  }
  
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    loginWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
