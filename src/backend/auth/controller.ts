import { deleteUser, getUser, isLogin, setUser } from './state'
import { session } from 'electron'
import { getLoginWindow } from '../login_window'
import { getMainWindow } from '../main_window'

import { notify } from '../dialog/dialog'
import { getRefreshToken, getToken } from '../auth/util'
import { UserInfo } from './type'
import { sendFrontendMessage } from '../ipc/manager'

const logout = () => {
  if (!isLogin) {
    return
  }
  deleteUser()
  sendFrontendMessage('sendUserInfo', {} as UserInfo)
  session.defaultSession.clearStorageData({ storages: ['cookies'] })
  // Clear cookies to ensure the user is logged out from the backend

  notify({
    title: 'Logout Successful',
    body: 'You have been logged out successfully.',
  })
  const main_window = getMainWindow()
  if (main_window) {
    main_window.reload()
  }
}

const login = async (userInfo: UserInfo) => {
  if (userInfo && !userInfo.displayName) {
    throw new Error('User information is incomplete')
  }
  console.log('Logging in user:', userInfo.displayName)
  setUser(userInfo)
  const user = getUser()
  if (!user || !user.displayName) {
    throw new Error('User information is not set correctly')
  }
  user.Authentication = {
    accessToken: await getToken(),
    refreshToken: await getRefreshToken(),
  }
  const loginWindow = getLoginWindow()
  user.deviceId = await loginWindow?.webContents
    .executeJavaScript('localStorage.getItem("deviceId");', true)
    .then((deviceId) => {
      return deviceId
    })
  console.log(user)

  setUser(user)

  if (loginWindow) {
    loginWindow.close()
  }
  notify({
    title: 'Login Successful',
    body: `Welcome, ${userInfo.displayName}!`,
  })
  const main_window = getMainWindow()
  if (main_window) {
    main_window.reload()
  }
}

const setAuth = async () => {
  const token = await getToken()
  const refreshToken = await getRefreshToken()
  if (!token || !refreshToken) {
    logout()
    notify({
      title: 'Authentication Error',
      body: 'Your session has expired. Please log in again.',
    })
    return
  }
  const user = getUser()
  if (user) {
    user.Authentication = {
      accessToken: token,
      refreshToken: refreshToken,
    }
    setUser(user)
  }
}

export { logout, login, setAuth }
