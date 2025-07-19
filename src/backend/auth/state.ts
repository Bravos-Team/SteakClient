import { UserInfo } from 'src/common/types/type'
import { configStore } from '../constants/key_value_store'

const setUSer = (user: UserInfo) => {
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
export { setUSer, getUser, deleteUser, isLogin }
