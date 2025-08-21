import { configStore } from '../electron_store/state'
import { UserInfo } from './type'

const setUser = (user: UserInfo) => {
  configStore.set('userInfo', user)
}
const getUser = (): UserInfo => {
  return configStore.get('userInfo', {} as UserInfo)
}
const deleteUser = () => {
  configStore.delete('userInfo')
}
const isLogin = (): boolean => {
  const user = getUser()
  return user && user.displayName !== null
}
export { setUser, getUser, deleteUser, isLogin }
