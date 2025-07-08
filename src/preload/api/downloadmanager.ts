import { frontendListenerSlot, makeHandlerCaller } from "../ipc";

export const install = makeHandlerCaller('install')
export const handleGameStatus = frontendListenerSlot('gameStatusUpdate')
export const getDMQueueInformation = makeHandlerCaller('getDMQueueInformation')
export const pausedDownload = makeHandlerCaller('pausedDownload')
export const resumeDownload = makeHandlerCaller('resumeDownload')
export const cancelDownload = makeHandlerCaller('cancelDownload')
export const handleDMQueueInformation = frontendListenerSlot('changedDMQueueInformation')