import { makeHandlerCaller, makeListenerCaller } from '../ipc'

export const login = makeHandlerCaller('login')
export const logout = makeListenerCaller('logout')
export const openLoginWindow = makeListenerCaller('openLoginWindow')
export const getUser = makeHandlerCaller('getUser')
export const setAuth = makeListenerCaller('setAuth')
