import { deleteUser, isLogin, setUser } from './state'
import { session } from 'electron'
import { getLoginWindow } from '../login_window'
import { getMainWindow } from '../main_window'
import { sendFrontendMessage } from '../ipc'
import { UserInfo } from 'src/common/types/type'
import { configStore } from '../constants/key_value_store'
import { notify } from '../dialog/dialog'

const logout = () => {
  if (!isLogin) {
    return
  }
  deleteUser()
  sendFrontendMessage('sendUserInfo', {} as UserInfo)
  session.defaultSession.clearStorageData({ storages: ['cookies'] })
  // Clear cookies to ensure the user is logged out from the backend
  const main_window = getMainWindow()
  if (main_window) {
    main_window.reload()
  }
  notify({
    title: 'Logout Successful',
    body: 'You have been logged out successfully.',
    icon: 'https://ccdn.steak.io.vn/logo_steak.svg',
  })
}

const login = (userInfo: UserInfo) => {
  if (userInfo && !userInfo.displayName) {
    throw new Error('User information is incomplete')
  }
  console.log('Logging in user:', userInfo.displayName)
  setUser(userInfo)
  const loginWindow = getLoginWindow()
  if (loginWindow) {
    loginWindow.close()
  }
  notify({
    title: 'Login Successful',
    body: `Welcome, ${userInfo.displayName}!`,
    icon: 'https://ccdn.steak.io.vn/logo_steak.svg',
  })
}
export { logout, login }
