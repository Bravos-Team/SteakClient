import type { DMQueueElement } from 'src/common/types/type'
import { addHandler, addListener } from '../ipc'
import {
  addToQueue,
  cancelDownload,
  getQueueInformation,
  paused,
  removeFinished,
  resumeDownload,
} from './manager'

addHandler('install', async (e, args) => {
  const dmQueueElement: DMQueueElement = {
    type: 'install',
    params: args,
    addToQueueTime: Date.now(),
    endTime: 0,
    starTime: 0,
  }

  await addToQueue(dmQueueElement)
})
addHandler('getDMQueueInformation', getQueueInformation)
addListener('pausedDownload', (e, app_name) => {
  paused(app_name)
})
addListener('resumeDownload', (e, app_name) => {
  resumeDownload(app_name)
})
addListener('cancelDownload', async (e, appName) => {
  cancelDownload(appName)
})

addListener('removeFinished', (e, appName) => {
  removeFinished(appName)
})
