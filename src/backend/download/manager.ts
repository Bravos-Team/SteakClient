import { DMQueueElement } from 'src/common/types/type'
import { createAbortController } from '../util/aborthandler/aborthandler'
import { updateFrontendQueue, updateGameStatus } from './events'
import { installGame, stopDownloadFile } from './controller'

import {
  getCurrentElement,
  getFinished,
  getInstalledGames,
  getQueue,
  getQueueState,
  indexOfFinishedElement,
  indexOfQueueElement,
  removeFromFinished,
  removeFromInstalledGames,
  removeFromQueue,
  setCurrentElement,
  setFinished,
  setInstalledGames,
  setQueue,
  setQueueState,
} from './state'
import { launchGame, removeFolder } from '../utils'
import path from 'path'
import { homePath } from '../constants/path'
import { notify } from '../dialog/dialog'
import axios, { AxiosError } from 'axios'
import { DownloadInfo } from '@/types/type'
import { getUser } from '../auth'
import { initWebSocket } from '../ws/util'
import { WineManager } from '../wine/manager'
import { wineStore } from '../constants/key_value_store'
import { CommonDependencies, WineInstallInfo } from '../wine/type'
import { WINEGE_URL } from '../wine/constants'
import { SystemUtils } from '../wine/util'

// Function to initialize the download queue

async function init() {
  const queue = getQueue()
  if (!queue.length) {
    setQueueState('idle')
    return
  }
  if (queue.every((el) => el.status === 'paused')) {
    console.log('All elements in the queue are paused, setting queue state to paused')
    setQueueState('paused')
    setCurrentElement(null)
    // updateFrontendQueue(queue, queueState, getFinished())
    return
  }
  // Logic to initialize the queue, e.g., starting the first download
  console.log('Initializing download queue with elements:', queue)

  while (queue.length) {
    // Get the first element in the queue
    const element = queue[0]
    queue[0].status = 'downloading' // Set the status of the first element to downloading
    // Log the start time for the current element
    element.startTime = Date.now()
    setQueue(queue)
    setCurrentElement(element)
    setQueueState('running')
    updateFrontendQueue(getQueue(), 'running', getFinished())

    // Logic to install the game
    const crl = createAbortController(element.params.appName).signal
    try {
      await installGame(element, crl)

      // Mark the game as installed
      element.params.gameInfo.details.is_installed = true
      element.endTime = Date.now()
      element.status = 'done'

      const installedElements = getInstalledGames()
      if (!installedElements[element.params.appName]) {
        installedElements[element.params.appName] = {
          appName: element.params.appName,
          executable: element.downloadInfo?.execPath || '',
          install_path: path.join(element.params.path, element.params.appName.toString()),
          install_size: element.params.installSize || 0,

          version: element.params.gameInfo.details.version,
        }
      }

      setInstalledGames(installedElements)

      const finishedElements = getFinished()
      if (!finishedElements.some((el) => el.params.appName === element.params.appName)) {
        finishedElements.push(element)
      } else {
        const index = finishedElements.findIndex(
          (el) => el.params.appName === element.params.appName,
        )
        finishedElements[index] = element
      }

      // Remove the current element from the queue
      queue.shift()

      setQueue(queue)
      // Update the finished elements in the state
      setFinished(finishedElements)

      // Update the queue state and current element

      console.log(`Download for ${element.params.appName} completed`)

      updateFrontendQueue(getQueue(), getQueueState(), getFinished())
      // Notify the frontend about the updated queue and game status
      setQueueState('idle') // Set the queue state to idle after processing the element
      setCurrentElement(null) // Clear the current element after processing
      // Update the frontend queue and game status

      updateGameStatus({
        appName: element.params.appName,
        folder: element.params.path,
        status: 'done',
      })
      notify({
        title: element.params.gameInfo.details.title || 'Download Completed',
        body: `Download completed!`,
      })
    } catch (error) {
      // Check if the download was paused
      if (error instanceof Error && error.message.includes('paused')) {
        console.log(`Download for ${element.params.appName} paused`)
        return
      }
      // If the download was aborted or failed, handle it
      console.error(`Error downloading ${element.params.appName}:`, error)
      element.status = 'error'
      element.endTime = Date.now()

      // Update the current element status
      setCurrentElement(element)
      // Update the queue state to idle
      setQueueState('idle')
      queue[0].status = 'error' // Set the status of the first element to error
      setQueue(queue)
      // Remove errored element from queue

      // Remove the current element from the queue
      updateFrontendQueue(getQueue(), getQueueState(), getFinished())
      updateGameStatus({
        appName: element.params.appName,
        folder: element.params.path,
        status: 'error',
      })
      stopDownloadFile(element.params.appName) // Stop the download if it failed

      if (error instanceof Error && error.message.includes('headers')) {
        const token = getUser()?.Authentication?.accessToken
        if (!token) {
          notify({
            title: element.params.gameInfo.details.title || 'Download Failed',
            body: `Login expired, please login again`,
          })
          return
        }
        const res = await axios
          .get(
            'https://api.steak.io.vn/api/v1/store/public/games/download/' + element.params.appName,
            {
              headers: {
                Cookie: `access_token=${token}`,
                'Content-Type': 'application/json',
              },
            },
          )
          .catch((err: AxiosError) => {
            notify({
              title: element.params.gameInfo.details.title || 'Download Failed',
              body: `Download failed: ${(err as Error).message}`,
            })

            return null
          })

        if (res && res.data) {
          queue[0].downloadInfo = res.data as DownloadInfo
          queue[0].status = 'downloading'
          setQueue(queue)
          init() // Reinitialize the queue to start the download again
        }

        return
      }
      notify({
        title: element.params.gameInfo.details.title || 'Download Failed',
        body: `Download failed: ${(error as Error).message}`,
      })
      removeFromQueue(element.params.appName) // Remove the element from the queue
      setQueue(getQueue()) // Update the queue state
      updateFrontendQueue(getQueue(), getQueueState(), getFinished())
    }
  }
}

// Function to add a new element to the download queue
async function addToQueue(element: DMQueueElement) {
  if (!element || !element.params || !element.params.appName) {
    throw new Error('Invalid element or missing appName in params')
  }
  const elements = getQueue()
  const index = indexOfQueueElement(element.params.appName)
  // Check if the element already exists in the queue

  if (index >= 0) {
    // If it exists, update the existing element
    elements[index] = element
  } else {
    // If it doesn't exist, add the new element to the queue
    elements.push(element)
  }
  setQueue(elements)
  // Update the frontend queue and game status

  updateFrontendQueue(elements, getQueueState())
  updateGameStatus({
    appName: element.params.appName,
    folder: element.params.path,
    status: 'queued',
  })
  notify({
    title: element.params.gameInfo.details.title || 'Download Added',
    body: `Add Queue ...`,
  })
  // If the queue is idle or paused, initialize the queue
  if (getQueueState() === 'idle') {
    await init()
  }
}

// Function to pause the current download
function paused(appName: string) {
  if (!appName) {
    throw new Error('App name is required to pause the download')
  }
  const currentElement = getCurrentElement()
  if (!currentElement || currentElement.params.appName !== appName) {
    throw new Error(`No download in progress for app: ${appName}`)
  }

  // Update the queue state to paused
  setQueueState('paused')

  // Pause the download using the utility function
  stopDownloadFile(appName)

  // Update the current element status to paused
  currentElement.status = 'paused'
  currentElement.endTime = Date.now()

  // Update the queue and frontend
  const queue = getQueue().filter((el) => el.params.appName !== appName)
  queue.push(currentElement)
  setQueue(queue)
  setCurrentElement(null)

  // Notify the frontend about the paused download

  updateFrontendQueue(queue, getQueueState(), getFinished())
  updateGameStatus({
    appName: currentElement.params.appName,
    folder: currentElement.params.path,
    status: 'paused',
  })
  notify({
    title: queue[0]?.params.gameInfo.details.title || 'Download Paused',
    body: `Paused ...`,
  })

  const remainingQueue = queue.filter((el) => el.status !== 'paused')
  if (remainingQueue.length > 0) {
    init() // Reinitialize the queue to handle the paused state
  } else {
    setQueueState('paused') // If no remaining downloads, set the queue state to idle
  }
}

// Function to cancel a download
function cancelDownload(appName: string) {
  if (!appName) {
    throw new Error('App name is required to cancel the download')
  }
  // Check if the current element is downloading the specified app
  const queue = getQueue()
  const index = indexOfQueueElement(appName)
  const outputPath = queue[index]?.params.path || path.join(homePath, 'Games')

  if (index < 0) {
    console.warn(`No download found for ${appName} in the queue`)
    return
  }

  notify({
    title: queue[index]?.params.gameInfo.details.id || 'Download Cancelled',
    body: `Download cancelled`,
  })
  // Remove the app from the queue
  removeFromQueue(appName)
  if (getQueueState() === 'running') {
    // If the current element is the one being cancelled, set it to null
    setCurrentElement(null)
    stopDownloadFile(appName) // Stop the download using the utility function
    setQueueState('idle') // Update the queue state to idle
  }
  setQueueState('idle') // Update the queue state to idle
  // Update the current element status to aborted
  const isCurrent = getCurrentElement()?.params.appName === appName
  if (isCurrent) {
    setCurrentElement(null)
  }
  // Update the queue state to idle
  setQueueState('idle')

  // Notify the frontend about the paused download
  updateFrontendQueue(getQueue(), getQueueState(), getFinished())
  updateGameStatus({
    appName,
    folder: getCurrentElement()?.params.path || '',
    status: 'aborted',
  })

  if (getQueue().length > 0) {
    console.log(`Queue is not empty, reinitializing the queue`)
    init() // Reinitialize the queue to handle the next download
  }
}

// Function to resume a paused download
function resumeDownload(appName: string) {
  const queue = getQueue()
  const index = indexOfQueueElement(appName)
  const currentElement = getCurrentElement()
  const queueState = getQueueState()

  console.log(queue[index].status)

  if (!appName) {
    throw new Error('App name is required to resume the download')
  }
  // Check if the app exists in the queue
  if (queueState === 'running' && currentElement?.params.appName !== appName) {
    if (currentElement !== null) {
      stopDownloadFile(currentElement.params.appName)
      setCurrentElement(null)
    }
  }

  if (index >= 0 && (queue[index].status === 'error' || queue[index].status === 'paused')) {
    console.log(432)

    queue[index].status = 'downloading' // Set the status of the resumed element to downloading
    queue[index].startTime = Date.now() // Reset the start time for the resumed element

    const [resumedElement] = queue.splice(index, 1)
    queue.unshift(resumedElement)
    setCurrentElement(null)
    setQueue(queue)
  }

  if (!getCurrentElement()) {
    init()
  }
}

function removeFinished(appName: string) {
  // Check if the app exists in the finished downloads
  if (!appName) {
    throw new Error('App name is required to remove a finished download')
  }

  // Find the index of the finished element
  const index = indexOfFinishedElement(appName)
  if (index < 0) {
    console.warn(`No finished download found for ${appName}`)
    return
  }

  // find the output path for the finished element
  const outputPath = getFinished()[index]?.params.path || path.join(homePath, 'Games')

  // Remove folder in the output path for the finished element
  removeFolder(outputPath, getFinished()[index]?.params.gameInfo.details.id.toString() || '')

  // Remove the finished element from the state
  removeFromFinished(appName)

  // Remove the installed game information
  removeFromInstalledGames(appName)

  // Notify the frontend about the removed finished download
  notify({
    title: getFinished()[index]?.params.gameInfo.details.title || 'Download Finished',
    body: `Removed finished download`,
  })

  // Update the queue state and current element
  updateFrontendQueue(getQueue(), getQueueState(), getFinished())
}
// Function to get the current queue information
function getQueueInformation() {
  return {
    elements: getQueue(),
    finished: getFinished(),
    state: getQueueState(),
  }
}
// Function to launch a game
async function launch(appName: string, deviceId: string) {
  const installedElements = getInstalledGames()
  const token = getUser()?.Authentication?.accessToken
  const gameId = getFinished().find((el) => el.params.appName === appName)?.params.gameInfo.details
    .id
  console.log(`Launching game: ${token}, Game ID: ${gameId}, Device ID: ${deviceId}`)

  let webSocket: ReturnType<typeof initWebSocket> | null = null
  if (!token || !gameId || !deviceId) {
    notify({
      title: 'Launch Failed',
      body: `Login expired, please login again`,
    })
    return
  }
  if (installedElements[appName]) {
    const { executable, install_path } = installedElements[gameId]

    const safeExecutable = executable.replace(/^[/\\]+/, '')

    const fullPath = path.join(install_path, safeExecutable)
    if (process.platform === 'win32') {
      const child = launchGame(fullPath, install_path)
      if (process.platform)
        child.on('spawn', () => {
          console.log(`Game launched successfully: ${fullPath}`)
          webSocket = initWebSocket(token, gameId, deviceId)
          if (webSocket) {
            webSocket.connect(
              () => {
                console.log('WebSocket connected for game launch')
              },
              (error) => {
                console.error('WebSocket connection error:', error)
              },
            )
          }

          updateGameStatus({
            appName,
            folder: install_path,
            status: 'launching',
          })
        })

      child.on('error', (error) => {
        console.error('Error launching game:', error)
        notify({
          title: 'Launch Failed',
          body: `Failed to launch game: ${error.message}`,
        })
      })
      child.on('close', (code) => {
        console.log(`Game process exited with code: ${code}`)
        if (webSocket) {
          webSocket.disconnect()
        }
        updateGameStatus({
          appName,
          folder: install_path,
          status: 'done',
        })
      })
    }

    const wineManager = new WineManager()
    const wineInstallations = wineStore.get('wineInstallation', [] as WineInstallInfo[])
    console.log(wineInstallations)
    let wineInstalled = wineInstallations[0]
    if (wineInstallations.length <= 0) {
      await wineManager.saveWineFetchInfo(WINEGE_URL)
      await wineManager.downloadWine()
      wineInstalled = wineStore.get('wineInstallation', [] as WineInstallInfo[])[0]
    }

    if (!wineInstalled.installed) {
      notify({
        title: 'Wine Not Installed',
        body: `Please install Wine ${wineInstalled.name} before launching the game.`,
      })
      return
    }
    const savePath = path.join(homePath, 'Games')
    const pathPrefix = path.join(savePath, appName.toString())
    if (!SystemUtils.fileExists(pathPrefix)) {
      const isCreating = await wineManager.createPreFix(
        appName.toString(),
        savePath,
        'win64',
        wineInstalled.installPath,
      )
      if (!isCreating) {
        notify({
          title: 'Wine Prefix Creation Failed',
          body: `Failed to create Wine prefix for ${appName}`,
        })
        return
      }
      wineManager.setActivePrefix(pathPrefix)
      await wineManager.installDependencies([
        CommonDependencies.DXVK,
        CommonDependencies.VKD3D,
        CommonDependencies.COREFONTS,
        CommonDependencies.LIBERATION,
      ])
    }

    if (wineManager.setActivePrefix(pathPrefix) && wineManager.setWineInstallation(wineInstalled)) {
      // Launch the game

      wineManager.rungame(install_path, safeExecutable)
    }
  }
}
export {
  init,
  addToQueue,
  paused,
  cancelDownload,
  resumeDownload,
  getQueueInformation,
  removeFinished,
  launch,
}
