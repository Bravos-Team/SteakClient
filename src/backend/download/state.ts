import { TypeCheckedStoreBackEnd } from '../electron_store/manager'
import { DMQueueElement, DownloadManagerState, InstalledInfo } from './type'

let queueState: DownloadManagerState = 'idle'
let currentElement: DMQueueElement | null = null
// Create a store for the download manager state
const store = new TypeCheckedStoreBackEnd('downloadManager', {
  cwd: 'store',
  name: 'download-manager',
})

const setInstalledGames = (installedGames: Record<string, InstalledInfo>) => {
  store.set('installedGames', installedGames)
}
const getInstalledGames = (): Record<string, InstalledInfo> => {
  return store.get('installedGames', {}) //
}
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cleanedElements = elements.map(({ downloadInfo, ...rest }) => rest)
  store.set('finished', cleanedElements)
}
const removeFromQueue = (id: string) => {
  const queue = getQueue()
  const index = queue.findIndex((el) => el.params.id === id)
  if (index !== -1) {
    queue.splice(index, 1)
    setQueue(queue)
  }
}
const removeFromFinished = (id: string) => {
  const finished = getFinished()
  const index = finished.findIndex((el) => el.params.id === id)
  if (index !== -1) {
    finished.splice(index, 1)
    setFinished(finished)
  }
}
const removeFromInstalledGames = (id: string) => {
  const installedGames = getInstalledGames()
  if (installedGames[id]) {
    delete installedGames[id]
    setInstalledGames(installedGames)
  }
}
const indexOfQueueElement = (id: string): number => {
  const queue = getQueue()
  return queue.findIndex((el) => el.params.id === id)
}
const indexOfFinishedElement = (id: string): number => {
  const finished = getFinished()
  return finished.findIndex((el) => el.params.id === id)
}
const indexOfInstalledGame = (id: string): number => {
  const installedGames = getInstalledGames()
  return Object.keys(installedGames).indexOf(id)
}

export {
  queueState,
  currentElement,
  getQueue,
  setQueue,
  setInstalledGames,
  getInstalledGames,
  getFinished,
  setFinished,
  setQueueState,
  getQueueState,
  getCurrentElement,
  setCurrentElement,
  removeFromQueue,
  removeFromFinished,
  removeFromInstalledGames,
  indexOfQueueElement,
  indexOfFinishedElement,
  indexOfInstalledGame,
}
