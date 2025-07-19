import { UserInfo } from 'src/common/types/type'
import { steakLoginUrl } from '../constants/url'
import { addHandler, addListener, sendFrontendMessage } from '../ipc'
import { createLoginWindow, getLoginWindow } from '../login_window'
import { logout, updateUser } from './events'
import { getUser } from './state'
import { getMainWindow } from '../main_window'

addListener('openLoginWindow', async () => {
  const loginWindow = createLoginWindow()
  loginWindow.loadURL(steakLoginUrl)
  loginWindow.show()
  loginWindow.focus()
})
addHandler('login', async (e, userInfo: UserInfo) => {
  const loginWindow = getLoginWindow()
  // if (loginWindow && loginWindow.isDestroyed()) {
  //   throw new Error('Login window is already destroyed')
  // }
  updateUser(userInfo)

  if (loginWindow) {
    loginWindow.close()
  }
  const mainWindow = getMainWindow()
  if (mainWindow) {
    mainWindow.reload()
  }
  // sendFrontendMessage('sendUserInfo', userInfo)
})
addHandler('getUser', () => {
  const user = getUser()
  if (!user || !user.displayName) {
    throw new Error('User is not logged in')
  }
  return user
})

addListener('logout', () => {
  logout()
  const mainWindow = getMainWindow()
  if (mainWindow) {
    mainWindow.reload()
  }
})
