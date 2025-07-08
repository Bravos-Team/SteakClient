import type { DMQueueElement } from 'src/common/types/type'
import { addHandler } from '../ipc'
import { addToQueue, cancelDownload, getQueueInformation, paused } from './manager'

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
addHandler('resumeDownload', async () => {
  // await resumeDownload()
})
addHandler('cancelDownload', async (e, appName) => {
  await cancelDownload(appName)
})
