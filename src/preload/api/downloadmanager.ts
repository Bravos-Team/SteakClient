import { frontendListenerSlot, makeHandlerCaller, makeListenerCaller } from '../ipc'

export const install = makeHandlerCaller('install')
export const handleGameStatus = frontendListenerSlot('gameStatusUpdate')
export const getDMQueueInformation = makeHandlerCaller('getDMQueueInformation')
export const pausedDownload = makeListenerCaller('pausedDownload')
export const resumeDownload = makeListenerCaller('resumeDownload')
export const cancelDownload = makeListenerCaller('cancelDownload')
export const handleDMQueueInformation = frontendListenerSlot('changedDMQueueInformation')
export const removeFinished = makeListenerCaller('removeFinished')
