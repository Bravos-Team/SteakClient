import { deleteUser, getUser, isLogin, setUser } from './state'
import { session } from 'electron'
import { getLoginWindow } from '../login_window'
import { getMainWindow } from '../main_window'
import { sendFrontendMessage } from '../ipc'
import { UserInfo } from 'src/common/types/type'
import { notify } from '../dialog/dialog'
import { getRefreshToken, getToken } from '../utils'

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
  setUser(user)
  const loginWindow = getLoginWindow()
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

export { logout, login }
