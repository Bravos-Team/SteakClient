import { getUser } from '../auth'
import { addHandler, addListener } from '../ipc/manager'
import { exitGame } from '../utils'
import {
  addToQueue,
  cancelDownload,
  getGameStatusList,
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
addHandler('getGameStatusList', getGameStatusList)
addListener('pausedDownload', (e, id) => {
  paused(id)
})
addListener('resumeDownload', (e, id) => {
  resumeDownload(id)
})
addListener('cancelDownload', async (e, id) => {
  cancelDownload(id)
})
addListener('exitGame', (e, id) => {
  exitGame(id)
})
addListener('removeFinished', (e, id) => {
  removeFinished(id)
})
addHandler('launchGame', async (e, id) => {
  const user = getUser()

  await launch(id, user.deviceId || '')
})
