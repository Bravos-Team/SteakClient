import type { DMQueueElement } from 'src/common/types/type'
import { addHandler } from '../ipc'
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
;(addHandler('getDMQueueInformation', getQueueInformation),
  addHandler('pausedDownload', async (e, appName) => {
    await paused(appName)
  }))
addHandler('resumeDownload', async (e, app_name) => {
  await resumeDownload(app_name)
})
addHandler('cancelDownload', async (e, appName) => {
  await cancelDownload(appName)
})

addHandler('removeFinished', async (e, appName) => {
  await removeFinished(appName)
})
