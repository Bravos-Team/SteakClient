import { steakApiUrl } from "../constants/url"
import { getMainWindow } from "../main_window"

export async function getToken() {
  const main_window = getMainWindow()
  if (!main_window) {
    throw new Error('Main window is not available')
  }
  const url = new URL('/api/v1/user', steakApiUrl)
  const cookie = await main_window.webContents.session.cookies.get({
    url: url.href,
    name: 'access_token',
  })
  const token = cookie.length > 0 ? cookie[0].value : ''
  return token as string
}
export async function getRefreshToken() {
  const main_window = getMainWindow()
  if (!main_window) {
    throw new Error('Main window is not available')
  }
  const url = new URL('/api/v1/user/auth/refresh', steakApiUrl)
  const cookie = await main_window.webContents.session.cookies.get({
    url: url.href,
    name: 'refresh_token',
  })

  return cookie.length > 0 ? cookie[0].value : ''
}

export async function removeToken(){
  const main_window = getMainWindow()
  if (!main_window) {
    throw new Error('Main window is not available')
  }
  const url = new URL('/api/v1/user', steakApiUrl)
  return await main_window.webContents.session.cookies.remove(url.href, 'access_token')
}
