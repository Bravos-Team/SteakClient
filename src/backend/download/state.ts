import { DMQueueElement, DownloadManagerState } from 'src/common/types/type'
import { TypeCheckedStoreBackEnd } from '../electron_store'

let queueState: DownloadManagerState = 'idle'
let currentElement: DMQueueElement | null = null
// Create a store for the download manager state
const store = new TypeCheckedStoreBackEnd('downloadManager', {
  cwd: 'store',
  name: 'download-manager',
})
const setQueueState = (state: DownloadManagerState) => {
  queueState = state
}
const getQueueState = (): DownloadManagerState => {
  return queueState
}
const getCurrentElement = (): DMQueueElement | null => {
  return currentElement
}
const setCurrentElement = (element: DMQueueElement | null) => {
  currentElement = element
}

const getQueue = (): DMQueueElement[] => {
  return store.get('queue', [])
}

const setQueue = (elements: DMQueueElement[]) => {
  store.set('queue', elements)
}

const getFinished = (): DMQueueElement[] => {
  return store.get('finished', [])
}
const setFinished = (elements: DMQueueElement[]) => {
  store.set('finished', elements)
}
const removeFromQueue = (appName: string) => {
  const queue = getQueue()
  const index = queue.findIndex((el) => el.params.appName === appName)
  if (index !== -1) {
    queue.splice(index, 1)
    setQueue(queue)
  }
}

export {
  queueState,
  currentElement,
  getQueue,
  setQueue,
  getFinished,
  setFinished,
  setQueueState,
  getQueueState,
  getCurrentElement,
  setCurrentElement,
  removeFromQueue,
  
}
