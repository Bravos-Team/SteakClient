import type { DMQueueElement } from 'src/common/types/type'
import { addHandler, addListener } from '../ipc'
import {
  addToQueue,
  cancelDownload,
  getQueueInformation,
  launch,
  paused,
  removeFinished,
  resumeDownload,
} from './manager'
import { getInstalledGames } from './state'
import { launchGame } from '../utils'

addHandler('install', async (e, args, data) => {
  const dmQueueElement: DMQueueElement = {
    type: 'install',
    params: args,
    downloadInfo: data,
    addToQueueTime: Date.now(),
    endTime: 0,
    startTime: 0,
  }
  console.log(`Adding to queue:`, dmQueueElement)

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
addHandler('launchGame', async (e, appName) => {
  console.log(appName);
  
  launch(appName)
})
