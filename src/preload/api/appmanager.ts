import { frontendListenerSlot, makeHandlerCaller } from '../ipc'

export const openFolder = makeHandlerCaller('openFolder')
export const openFile = makeHandlerCaller('openFile')