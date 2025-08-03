import { makeHandlerCaller } from '../ipc'

export const openFolder = makeHandlerCaller('openFolder')
export const openFile = makeHandlerCaller('openFile')
export const getHomePath = makeHandlerCaller('getHomePath')
export const openWebViewDevTools = makeHandlerCaller('openWebViewDevTools')
export const getCapacitySystem = makeHandlerCaller('getCapacitySystem')
export const getSystemInfo = makeHandlerCaller('getSystemInfo')
