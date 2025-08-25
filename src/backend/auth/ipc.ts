import { steakLoginUrl } from '../constants/url'

import { createLoginWindow } from '../login_window'
import { getUser } from './state'
import { login, logout, setAuth } from './controller'
import { removeToken } from './util'
import { UserInfo } from './type'
import { addHandler, addListener } from '../ipc/manager'

addListener('openLoginWindow', () => {
  const loginWindow = createLoginWindow()
  loginWindow.loadURL(steakLoginUrl)
  console.log('Opening login window:', steakLoginUrl)

  loginWindow.show()
  loginWindow.focus()
})
addHandler('login', async (e, userInfo: UserInfo) => {
  await login(userInfo)
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

addHandler('removeToken', async () => {
  await removeToken()
})

addListener('setAuth', () => {
  setAuth()
})
