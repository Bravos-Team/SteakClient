import { DMQueueElement, InstalledInfo } from 'src/common/types/type'
import { createAbortController } from '../util/aborthandler/aborthandler'
import { updateFrontendQueue, updateGameStatus } from './events'
import { installGame, stopDownloadFile } from './controller'

import {
  getCurrentElement,
  getFinished,
  getInstalledGames,
  getQueue,
  getQueueState,
  removeFromQueue,
  setCurrentElement,
  setFinished,
  setInstalledGames,
  setQueue,
  setQueueState,
} from './state'
import { removeFolder, toPascalCase } from '../utils'
import path from 'path'
import { homePath } from '../constants/path'
import { notify } from '../dialog/dialog'

// Function to initialize the download queue

async function init() {
  let queue = getQueue()
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

      // Update the finished elements
      console.log(element.downloadInfo)

      const installedElements = getInstalledGames()
      if (!installedElements[element.params.appName]) {
        installedElements[element.params.appName] = {
          appName: element.params.appName,
          executable: element.downloadInfo?.execPath || '',
          install_path: element.params.path,
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
      queue = getQueue()
      queue.shift()

      setQueue(queue)
      // Update the finished elements in the state
      setFinished(finishedElements)

      // Update the queue state and current element

      console.log(`Download for ${element.params.appName} completed`)

      updateFrontendQueue(queue, getQueueState(), finishedElements)
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
      // Remove errored element from queue
      queue = getQueue()
      queue.shift()
      setQueue(queue)
      // Remove the current element from the queue
      updateFrontendQueue(getQueue(), getQueueState(), getFinished())
      updateGameStatus({
        appName: element.params.appName,
        folder: element.params.path,
        status: 'error',
      })
    }
  }
}

// Function to add a new element to the download queue
async function addToQueue(element: DMQueueElement) {
  if (!element || !element.params || !element.params.appName) {
    throw new Error('Invalid element or missing appName in params')
  }
  const elements = getQueue()
  // Check if the element already exists in the queue
  const elementIndex = elements.findIndex((el) => el.params.appName === element.params.appName)
  if (elementIndex >= 0) {
    // If it exists, update the existing element
    elements[elementIndex] = element
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
  const index = queue.findIndex((el) => el.params.appName === appName)
  const outputPath = queue[index]?.params.path || path.join(homePath, 'Games')
  if (index < 0) {
    console.warn(`No download found for ${appName} in the queue`)
    return
  }

  notify({
    title: queue[index]?.params.gameInfo.details.title || 'Download Cancelled',
    body: `Download cancelled`,
  })
  // Remove the app from the queue
  removeFromQueue(appName)
  if (getQueueState() === 'running') {
    // If the current element is the one being cancelled, set it to null
    setCurrentElement(null)
    stopDownloadFile(appName) // Stop the download using the utility function

    removeFolder(outputPath, toPascalCase(queue[index]?.params.gameInfo.details.title || '')) // Remove the folder if needed
    setQueueState('idle') // Update the queue state to idle
  }
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

  if (queue.length > 0) {
    console.log(`Queue is not empty, reinitializing the queue`)
    init() // Reinitialize the queue to handle the next download
  }
}

// Function to resume a paused download
function resumeDownload(appName: string) {
  console.log(`Resuming download for app: ${appName}`)
  console.log(`Current queue state: ${getQueueState()}`)

  const currentElement = getCurrentElement()
  const queue = [...getQueue()]
  console.log(`Current element: ${currentElement ? currentElement.params.appName : 'none'}`)

  if (getQueueState() === 'running' && currentElement?.params.appName !== appName) {
    if (currentElement) {
      stopDownloadFile(currentElement.params.appName) // Stop the current download if it's running
      setCurrentElement(null) // Clear the current element
    }
  }
  const index = queue.findIndex((el) => el.params.appName === appName)
  if (index >= 0) {
    const [resumedElement] = queue.splice(index, 1)
    queue.unshift(resumedElement)
    queue[0].status = 'downloading' // Set the resumed element status to downloading
    setQueue(queue)
  }
  console.log(getQueueState())

  if (!getCurrentElement()) {
    init()
  }
}
function removeFinished(appName: string) {
  const finishedElements = getFinished()
  const index = finishedElements.findIndex((el) => el.params.appName === appName)
  const outputPath = finishedElements[index]?.params.path || path.join(homePath, 'Games')
  console.log(`Removing finished download for app: ${appName} at path: ${outputPath}`)
  removeFolder(
    outputPath,
    toPascalCase(finishedElements[index]?.params.gameInfo.details.title || ''),
  )
  notify({
    title: finishedElements[index]?.params.gameInfo.details.title || 'Download Finished',
    body: `Removed finished download`,
  })
  if (index >= 0) {
    finishedElements.splice(index, 1)
    setFinished(finishedElements)
  } else {
    console.warn(`No finished download found for ${appName}`)
  }
  updateFrontendQueue(getQueue(), getQueueState(), finishedElements)
  console.log(`Removed finished download for ${appName}`)

  // Remove the folder if needed
}
function getQueueInformation() {
  return {
    elements: getQueue(),
    finished: getFinished(),
    state: getQueueState(),
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
}
