
import { addHandler, addListener } from '../ipc/manager'
import {
  addToQueue,
  cancelDownload,
  getQueueInformation,
  launch,
  paused,
  removeFinished,
  resumeDownload,
} from './manager'
import { DMQueueElement } from './type'

addHandler('install', async (e, args, data) => {
  const dmQueueElement: DMQueueElement = {
    type: 'install',
    params: args,
    downloadInfo: data,
    addToQueueTime: Date.now(),
    endTime: 0,
    startTime: 0,
  }


  await addToQueue(dmQueueElement)
})
addHandler('getDMQueueInformation', getQueueInformation)
addListener('pausedDownload', (e, id) => {
  paused(id)
})
addListener('resumeDownload', (e, id) => {
  resumeDownload(id)
})
addListener('cancelDownload', async (e, id) => {
  cancelDownload(id)
})

addListener('removeFinished', (e, id) => {
  removeFinished(id)
})
addHandler('launchGame', async (e, id, deviceId) => {
  console.log(id)

  await launch(id, deviceId)
})
