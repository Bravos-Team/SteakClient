import { makeHandlerCaller, makeListenerCaller } from '../ipc'

export const openFolder = makeHandlerCaller('openFolder')
export const openFile = makeHandlerCaller('openFile')
export const getHomePath = makeHandlerCaller('getHomePath')
export const openWebViewDevTools = makeHandlerCaller('openWebViewDevTools')