import { UserInfo } from 'src/common/types/type'
import { sendFrontendMessage } from '../ipc'
import { deleteUser, setUSer } from './state'
import { session } from 'electron'

const updateUser = (userInfo: UserInfo) => {
  setUSer(userInfo)
  sendFrontendMessage('sendUserInfo', userInfo)
}

const logout = () => {
  deleteUser()
  sendFrontendMessage('sendUserInfo', {} as UserInfo)
  session.defaultSession.clearStorageData({ storages: ['cookies'] })
  // Clear cookies to ensure the user is logged out from the backend
}

export { updateUser, logout }
