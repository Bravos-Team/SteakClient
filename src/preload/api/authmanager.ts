import { frontendListenerSlot, makeHandlerCaller } from '../ipc'

export const login = makeHandlerCaller('login')
export const sendUserInfo = frontendListenerSlot('sendUserInfo')
