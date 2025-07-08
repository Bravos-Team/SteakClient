import { DMQueueElement } from 'src/common/types/type'
import { createAbortController } from '../util/aborthandler/aborthandler'
import { updateFrontendQueue, updateGameStatus } from './events'
import { installGame, stopDownloadFile } from './controller'

import {
  getCurrentElement,
  getFinished,
  getQueue,
  getQueueState,
  queueState,
  removeFromQueue,
  setCurrentElement,
  setFinished,
  setQueue,
  setQueueState,
} from './state'

// Function to initialize the download queue

async function init() {
  let queue = getQueue()
  if (!queue.length) {
    setQueueState('idle')
    return
  }
  // Logic to initialize the queue, e.g., starting the first download
  console.log('Initializing download queue with elements:', queue)
  setQueueState('running')

  while (queue.length) {
    // Get the first element in the queue
    const element = queue[0]

    // Log the start time for the current element
    element.starTime = Date.now()
    setCurrentElement(element)
    updateFrontendQueue(queue, queueState)

    // Logic to install the game
    const crl = createAbortController(element.params.appName).signal
    try {
      await installGame(element.params, crl)
    } catch (error) {
      // Check if the download was paused
      if (getQueueState() === 'paused') {
        console.log(`Download for ${element.params.appName} paused`)
        return
      }
      // If the download was aborted or failed, handle it
      console.error(`Error downloading ${element.params.appName}:`, error)
      element.status = 'error'
      element.endTime = Date.now()
      // Update the queue state to idle
      setQueueState('idle')
      // Remove the current element from the queue
      queue.shift()
      setQueue(queue)
      continue
    }
    // Mark the game as installed
    element.params.gameInfo.is_installed = true
    element.endTime = Date.now()
    element.status = 'done'

    // Update the finished elements
    const finishedElements = getFinished()
    if (!finishedElements.some((el) => el.params.appName === element.params.appName)) {
      finishedElements.push(element)
    } else {
      const index = finishedElements.findIndex((el) => el.params.appName === element.params.appName)
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
    // Notify the frontend about the updated queue and game status

    updateFrontendQueue(queue, queueState)
    updateGameStatus({
      appName: element.params.appName,
      folder: element.params.path,
      status: 'done',
    })
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
  // If the queue is idle or paused, initialize the queue
  if (getQueueState() === 'idle' || getQueueState() === 'paused') {
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
  const queue = getQueue().filter((el) => el.params.appName !== appName) // Remove the current element from the queue
  queue.push(currentElement)
  setQueue(queue)
  setCurrentElement(null)

  // Notify the frontend about the paused download

  updateFrontendQueue(queue, queueState)
  updateGameStatus({
    appName: currentElement.params.appName,
    folder: currentElement.params.path,
    status: 'paused',
  })
  if (getQueueState() === 'paused') {
    init() // Reinitialize the queue to handle the paused state
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
  if (index < 0) {
    console.warn(`No download found for ${appName} in the queue`)
    return
  }
  // Remove the app from the queue
  removeFromQueue(appName)
  if (getQueueState() === 'running') {
    // If the current element is the one being cancelled, set it to null
    setCurrentElement(null)
    stopDownloadFile(appName) // Stop the download using the utility function
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
  updateFrontendQueue(getQueue(), queueState)
  updateGameStatus({
    appName,
    folder: getCurrentElement()?.params.path || '',
    status: 'aborted',
  })
}

// Function to resume a paused download
async function resumeDownload(appName: string) {
  if (getQueueState() === 'paused') {
    setQueueState('running')

    // Start the download again
    
    await init()
  }
}

function getQueueInformation() {
  return {
    queue: getQueue(),
    finished: getFinished(),
    state: getQueueState(),
  }
}
export { init, addToQueue, paused, cancelDownload, resumeDownload, getQueueInformation }
