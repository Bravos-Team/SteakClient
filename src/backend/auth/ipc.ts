import { UserInfo } from 'src/common/types/type'
import { steakLoginUrl } from '../constants/url'
import { addHandler, addListener } from '../ipc'
import { createLoginWindow, getLoginWindow } from '../login_window'
import { getUser } from './state'
import { getMainWindow } from '../main_window'
import { login, logout } from './controller'

addListener('openLoginWindow', () => {
  const loginWindow = createLoginWindow()
  loginWindow.loadURL(steakLoginUrl)
  console.log('Opening login window:', steakLoginUrl)

  loginWindow.show()
  loginWindow.focus()
})
addHandler('login', async (e, userInfo: UserInfo) => {
  login(userInfo)
})
addHandler('getUser', () => {
  const user = getUser()
  if (!user || !user.displayName) {
    return null
  }
  return user
})

addListener('logout', () => {
  logout()
})
